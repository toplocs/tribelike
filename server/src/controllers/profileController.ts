import { Request, Response } from 'express';
import { profiles } from '../models';
import { RequestWithSession } from '../middleware';

export default class ProfileController {

  static async GetAllProfiles(req: Request, res: Response) {
    try {
        const allProfiles = await profiles.getAll();
        res.status(200).json(allProfiles);
    } catch(e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
  }

  static async GetAllProfilesForUser(req: Request, res: Response) {
    try {
      const { userId } = req.session;

      const userProfiles = await profiles.getAllByUserId(userId);
      res.status(200).json(userProfiles);
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async GetProfileById(req: Request, res: Response) {
    try {
        const profileId = req.params.id;
        const profile = await profiles.getById(profileId);
        
        if (profile) 
          res.status(200).json(profile);
        else 
          res.status(404).json({ error: 'Profile not found' });
    } catch(e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
  }

  static async CreateProfile(req: Request, res: Response) {
    const formData = req.body;
    try {
      const { userId } = req.session;

      const result = await profiles.create({
        ...formData,
        userId
      });
      
      if (result) 
        res.status(200).json(result);
      else 
        res.status(400).json({ error: 'Could not create profile' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async UpdateProfile(req: Request, res: Response) {
    const formData = req.body;
    try {
      const { userId } = req.session;

      // TODO: Ensure the profile belongs to the authenticated user
      const userProfiles = await profiles.getAllByUserId(userId);
      const profileBelongsToUser = userProfiles.some(profile => profile.id === formData.id);
      
      if (!profileBelongsToUser) {
        res.status(403).json({ error: 'Forbidden - Profile does not belong to user' });
        return;
      }

      const result = await profiles.update(formData.id, formData);
      
      if (result) 
        res.status(200).json(result);
      else 
        res.status(404).json({ error: 'Profile not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async DeleteProfile(req: Request, res: Response) {
    try {
      const { userId } = req.session;
      
      const profileId = req.query.id as string;
      
      if (!profileId) {
        res.status(400).json({ error: 'Profile ID is required' });
        return;
      }
      
      // Ensure the profile belongs to the authenticated user
      const userProfiles = await profiles.getAllByUserId(userId);
      const profileBelongsToUser = userProfiles.some(profile => profile.id === profileId);
      
      if (!profileBelongsToUser) {
        res.status(403).json({ error: 'Forbidden - Profile does not belong to user' });
        return;
      }

      const result = await profiles.delete(profileId);
      
      if (result) 
        res.status(200).json({ success: 'Profile deleted' });
      else 
        res.status(404).json({ error: 'Profile not found' });
    } catch(e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  }
}
