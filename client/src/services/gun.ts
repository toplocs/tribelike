import Gun from 'gun/gun' // You can also use 'gun' here
import 'gun/sea' // Optional: for user authentication
import 'gun/axe' // Optional: for better transport

const gun = Gun(['http://localhost:3000/gun']);

export default gun;
