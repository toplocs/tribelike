import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import {
  findInterestRelations,
  findLocationRelations,
  createInterestRelation,
  createLocationRelation,
  removeInterestRelation,
  removeLocationRelation
} from '../../actions/interest-relations';

const router = express.Router();
const upload = multer();

//--- Relations--- //
router.route('/:id/relations').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const [interestRelations, locationRelations] = await Promise.all([
    findInterestRelations(id),
    findLocationRelations(id)
  ]);

  if (interestRelations.success && locationRelations.success) {
    return res.status(200).json({
      children: [],
      members: [],
      interests: interestRelations.success,
      locations: locationRelations.success
    });
  } else {
    return res.status(400).json({
      error: interestRelations.error || locationRelations.error
    });
  }
});

// router.route('/:id/profiles').get(async (req: Request, res: Response) => {
//   const { success, error } = await getProfileInterests(req.params);

//   if (success) return res.status(200).json(success);
//   else return res.status(400).json(error);
// });


router.route('/interests/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await findInterestRelations(id);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).post(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await createInterestRelation(id, req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).delete(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await removeInterestRelation(id);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});

router.route('/locations/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await findLocationRelations(id);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).post(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await createLocationRelation(id, req.body);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
}).delete(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { success, error } = await removeLocationRelation(id);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});


export default router;