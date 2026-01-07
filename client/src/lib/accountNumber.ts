import gun from '@/services/gun';

/**
 * Generate a unique 6-digit account recovery number
 * Range: 100,000 to 999,999
 *
 * Uses Gun.js to verify uniqueness across the P2P network
 */
export async function generateAccountNumber(): Promise<number> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const accountNumber = Math.floor(100000 + Math.random() * 900000);

    // Check if account number already exists in Gun
    const existingData = await new Promise<any>((resolve) => {
      gun.get('account_numbers').get(accountNumber.toString()).once((data) => {
        resolve(data);
      }, { wait: 100 }); // Wait up to 100ms for Gun network
    });

    if (!existingData) {
      return accountNumber;
    }

    attempts++;
  }

  throw new Error('Failed to generate unique account number after 10 attempts');
}

/**
 * Store account number mapping in Gun
 */
export async function storeAccountNumber(
  accountNumber: number,
  email: string
): Promise<void> {
  gun.get('account_numbers').get(accountNumber.toString()).put({
    email,
    createdAt: Date.now(),
    active: true
  });

  gun.get('email_to_account').get(email).put({
    accountNumber
  });
}

/**
 * Verify account number belongs to email
 */
export async function verifyAccountNumber(
  email: string,
  accountNumber: number
): Promise<boolean> {
  return new Promise((resolve) => {
    gun.get('credentials').get(email).once((data) => {
      if (data && data.accountNumber === accountNumber) {
        resolve(true);
      } else {
        resolve(false);
      }
    }, { wait: 100 });
  });
}

/**
 * Get account number for email
 */
export async function getAccountNumber(email: string): Promise<number | null> {
  return new Promise((resolve) => {
    gun.get('credentials').get(email).once((data) => {
      if (data && data.accountNumber) {
        resolve(data.accountNumber);
      } else {
        resolve(null);
      }
    }, { wait: 100 });
  });
}
