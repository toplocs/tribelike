import Gun from 'gun' // You can also use 'gun' here
import 'gun/sea' // Optional: for user authentication

const gun = Gun(['http://localhost:3000/gun']);

export default gun;
