import { Router } from 'express';
import { getGun } from '../../gun';

const router = Router();

router.get('/', (req, res) => {
  try {
    const gun = getGun();
    
    gun.get('plugins').once((data: Object) => {
      if (!data) {
        return res.status(404).json({ message: 'No plugin data found' });
      }
      res.json(data);
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
