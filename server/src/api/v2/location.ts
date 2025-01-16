import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  getLocationByCoords,
  updateCurrentLocation,
  getProfileLocations,
} from '../../actions/location';

const router = express.Router();
const upload = multer();

router.route('/byCoords').get(async (req: Request, res: Response) => {
  let { lat, lng } = req.query as { lat: string; lng: string };
  const { success, error } = await getLocationByCoords({ lat, lng });

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/updateCurrent').post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await updateCurrentLocation(req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/:id/profiles').get(async (req: Request, res: Response) => {
  const { success, error } = await getProfileLocations(req.params);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});


export default router;