"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
/*router.route('/locations/:id').get(async (req: Request, res: Response) => {
  const { success, error } = await getProfileLocations(req.params);

  if (success)
    res.status(200).json(success);
  else
    res.status(400).json(error);
});
*/
exports.default = router;
