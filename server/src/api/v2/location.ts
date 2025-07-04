import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  getLocationByCoords,
  getLocationByBounds,
  updateCurrentLocation,
  getProfileLocations,
} from '../../actions/location';
import {
  findInterestRelations,
  findLocationRelations,
  createInterestRelation,
  createLocationRelation,
  createProfileRelation,
  removeInterestRelation,
  removeLocationRelation
} from '../../actions/location-relations';
import { auth } from '../../lib/auth';

const router = express.Router();
const upload = multer();

router.route('/byCoords').get(async (req: Request, res: Response) => {
  let { lat, lng } = req.query as { lat: string; lng: string };
  const { success, error } = await getLocationByCoords({ lat, lng });

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/byBounds').get(async (req: Request, res: Response) => {
  let { northeast, southwest } = req.query as { northeast: string; southwest: string };
  const { success, error } = await getLocationByBounds({ northeast, southwest });

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/updateCurrent').post(upload.none(), async (req: Request, res: Response) => {
  const { success, error } = await updateCurrentLocation(req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

//--- Relations--- //
router.route('/:id/profiles').get(async (req: Request, res: Response) => {
  const { success, error } = await getProfileLocations(req.params);
  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).post(async (req: Request, res: Response) => {
  const { success, error } = await createProfileRelation(req.params.id, req.body);
  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/interests/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await findInterestRelations(id);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).post(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await createInterestRelation(id, req.body);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).delete(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await removeInterestRelation(id);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

router.route('/locations/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await findLocationRelations(id);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).post(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const { success, error } = await createLocationRelation(id, data);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
}).delete(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await removeLocationRelation(id);

  if (success) 
    res.status(200).json(success);
  else 
    res.status(400).json(error);
});

export default router;