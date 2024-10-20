import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import { 
  findWikis,
  createWiki,
  updateWiki,
  getWikiById,
} from '../../actions/wiki';

const router = express.Router();
const upload = multer();

router.route('/').get(async (req: Request, res: Response) => {
  const { success, error } = await findWikis(req.query);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.post(upload.none(), async (req: Request, res: Response) => {
  const authHeader = req.get('Authorization');
  const { success, error } = await createWiki(req.body, authHeader);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})
.put(upload.none(), async (req: Request, res: Response) => {
  const authHeader = req.get('Authorization');
  const { success, error } = await updateWiki(req.body, authHeader);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
})

router.route('/byId/:id').get(async (req: Request, res: Response) => {
  const { success, error } = await getWikiById(req.params);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});


export default router;