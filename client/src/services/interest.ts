import gun from '@/services/gun';

const apiMethod = import.meta.env.API_METHOD;

class Interest {
	constructor() {
		this.store = apiMethod || 'gun';
	}

	static async GunGetAll(): Promise<Interest[]> {
		if (this.store == 'gun') {
			gun.get()
		} else {
			//await axios
		}
		
	}
}

function InterestService() {
	const interest = Interest;
	interest.setStore('gun')
	return interest;
}

const interest = new Interest({
	name: 'Chess',
});
interest.create();

export default InterestService();