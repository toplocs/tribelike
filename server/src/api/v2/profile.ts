import type { Request, Response } from 'express';
import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer();

/*router.route('/locations/:id').get(async (req: Request, res: Response) => {
  const { success, error } = await getProfileLocations(req.params);

  if (success) return res.status(200).json(success);
  else return res.status(400).json(error);
});
*/

export default router;