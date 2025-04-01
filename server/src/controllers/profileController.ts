import { Request, Response } from 'express';
import { profiles } from '../models';
import { AuthenticatedRequest } from '../middleware/authenticate';

export default class ProfileController {

  static async GetAllProfiles(req: Request, res: Response) {
    try {
        const allProfiles = await profiles.getAll();
        return res.status(200).json(allProfiles);
    } catch(e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
  }

  static async GetAllProfilesForUser(req: Request, res: Response) {
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const { userId } = authReq.auth;

      const userProfiles = await profiles.getAllByUserId(userId);
      return res.status(200).json(userProfiles);
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async GetProfileById(req: Request, res: Response) {
    try {
        const profileId = req.params.id;
        const profile = await profiles.getById(profileId);
        
        if (profile) return res.status(200).json(profile);
        else return res.status(404).json({ error: 'Profile not found' });
    } catch(e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
  }


  static async CreateProfile(req: Request, res: Response) {
    const formData = req.body;
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const { userId } = authReq.auth;

      const result = await profiles.create({
        ...formData,
        userId
      });
      
      if (result) return res.status(200).json(result);
      else return res.status(400).json({ error: 'Could not create profile' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async UpdateProfile(req: Request, res: Response) {
    const formData = req.body;
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const { userId } = authReq.auth;

      // TODO: Ensure the profile belongs to the authenticated user
      const userProfiles = await profiles.getAllByUserId(userId);
      const profileBelongsToUser = userProfiles.some(profile => profile.id === formData.id);
      
      if (!profileBelongsToUser) {
        return res.status(403).json({ error: 'Forbidden - Profile does not belong to user' });
      }

      const result = await profiles.update(formData.id, formData);
      
      if (result) return res.status(200).json(result);
      else return res.status(404).json({ error: 'Profile not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async DeleteProfile(req: Request, res: Response) {
    try {
      const authReq = req as unknown as AuthenticatedRequest;
      const { userId } = authReq.auth;
      
      const profileId = req.query.id as string;
      
      if (!profileId) {
        return res.status(400).json({ error: 'Profile ID is required' });
      }
      
      // Ensure the profile belongs to the authenticated user
      const userProfiles = await profiles.getAllByUserId(userId);
      const profileBelongsToUser = userProfiles.some(profile => profile.id === profileId);
      
      if (!profileBelongsToUser) {
        return res.status(403).json({ error: 'Forbidden - Profile does not belong to user' });
      }

      const result = await profiles.delete(profileId);
      
      if (result) return res.status(200).json({ success: 'Profile deleted' });
      else return res.status(404).json({ error: 'Profile not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
