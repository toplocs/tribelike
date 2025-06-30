import Gun, { SEA } from 'gun';
import hash from 'object-hash';


interface Message {
  user: string;
  text: string;
  timestamp: number;
}

interface SignedMessage extends Message {
  signature?: string;
}

let gun: any;
const pubKeys: Record<string, string> = {};

// Function to find a user's public key by name directly from Gun
const findPubKey = async (name: string): Promise<string | null> => {
  return new Promise((resolve) => {
    
    if (pubKeys[name]) {
      console.log('cached pub key: ', name, pubKeys[name]);
      resolve(pubKeys[name]);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    timeoutId = setTimeout(() => {
      resolve(null);
    }, 1000);

    gun.get(`~@${name}`).once((userRef: any) => {
      if (userRef && userRef._) {
        const soul = userRef._['>'] && Object.keys(userRef._['>'])[0];

        const pub = soul.substring(1);
        console.log('Public key:', pub);
        clearTimeout(timeoutId);
        pubKeys[name] = pub;
        resolve(pub as string);
      } else {
        console.log('User not found');
        clearTimeout(timeoutId);
        resolve(null);
      }
    });
  });
}

async function hashData(data: Message): Promise<string> {
  const content = data.user + data.text + data.timestamp;
  const dataHash = hash(content, {
    algorithm: 'sha1'
  });
  return dataHash;
}

async function verifyMessage(data: Message, signature: string): Promise<boolean> {
  if (!signature) return false;
  const pubKey = await findPubKey(data.user);
  if (!pubKey) {
    console.warn(`No public key found for user ${data.user}`);
    return false;
  }
  const dataHash = await hashData(data);
  console.log(dataHash, signature, data);
  const verified = await SEA.verify(signature, pubKey);
  return verified === dataHash;
}

const validateSignature = async (msg: any) => {
  console.log('in - put - chat:', msg.put);
  for (const key in msg.put) {
    if (key.startsWith('chat/')) {

      const data = msg.put[key];
      const message: Message = {
        user: data.user || { alias: 'Unknown' },
        text: data.text,
        timestamp: data.timestamp,
      };

      console.log('in - put - chat - message:', message.user, message.text, message.timestamp, data.signature); 
      const verified = await verifyMessage(message, data.signature);
      console.log('in - put - chat - valid:', verified, msg.put.chat.text);
      return verified;
    }
  }
  return true;
}

export function initGun(server: Object) {
  Gun.on('opt', function (context) {
    // 'tag' may not exist on context, so use optional chaining or log the whole context
    // console.log('Gun - Init:', context);
    console.log((context as any).store);
    
    const tags = (context as any)?.tag;
    // console.log("Tag - put:", tags.put.to);

    // Pass to subsequent opt handlers
    this.to.next(context);

    context.on('hi', function (msg) {
      console.log('Gun - Hi:', msg.id, msg.wire.headers.origin);
      this.to.next(msg);
    });

    context.on('bye', function (msg,) {
      const origin = (msg.wire && 'headers' in msg.wire && (msg.wire as any).headers?.origin) || undefined;
      console.log('Gun - Bye:', msg.id, origin);
      this.to.next(msg);
    });

    // context.on('out', function (msg,) {
    //   console.log('Gun - Out:', msg);
    //   this.to.next(msg);
    // });

    context.on('in', async function (msg) {
      
      if (msg['@']) {
        this.to.next(msg);
        return;
      }
      
      if (msg.put && msg.get) {
        console.log('Gun - In - put & get:', msg.put, msg.get);
      };

      if (msg.put) {
        if (msg.put.chat) {
          if (await validateSignature(msg)) {
            this.to.next(msg);
          }
          return;
        }
        else {
          console.log('Gun - In - put:', Object.keys(msg.put));
          this.to.next(msg);
          return;
        }
      }

      if (msg.get) {
        console.log('Gun - In - get:', msg.get['#']);
      }
      else {
        console.log('Gun - In:', msg);
      }
      
      this.to.next(msg);
    });
  })

  const options = {
    peers: [],
    multicast: false,
    file: 'db/db.json',
    web: server,
    radisk: false, 
    localStorage: true
  };

  gun = Gun(options);
  console.log('Gun initialized');

  // Sync everything
  // gun.on('out', { get: { '#': { '*': '' } } });

  return gun;
}

export function getGun() {
  if (!gun) {
    throw new Error('Gun has not been initialized. Call initGun(server) first.');
  }
  return gun;
}
