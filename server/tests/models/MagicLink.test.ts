import { beforeEach, describe, expect, it } from '@jest/globals';
import { Store } from '../../src/lib/Store';
import { MagicLink, MagicLinkModel } from '../../src/models';
import { Uuid } from '@tribelike/types';

describe('MagicLinkModel', () => {
  Store.getInstance().setStoreType('memory');
  const magicLinkStore = Store.getInstance().getStore<MagicLink>('MagicLink');
  let magicLinkModel: MagicLinkModel = new MagicLinkModel(magicLinkStore);

  const userId1: Uuid = 'user-123';
  const userId2: Uuid = 'user-456';
  
  const futureDate = new Date(Date.now() + 3600000); // 1 hour in the future
  const pastDate = new Date(Date.now() - 3600000); // 1 hour in the past
  
  beforeEach(async () => {
    await magicLinkModel.store.clear();
    
    // Add test data
    await magicLinkModel.store.create(new MagicLink({
      id: '1' as Uuid,
      token: 'valid-token-1',
      userId: userId1,
      expires: futureDate
    }));
    
    await magicLinkModel.store.create(new MagicLink({
      id: '2' as Uuid,
      token: 'valid-token-2',
      userId: userId1,
      expires: futureDate
    }));
    
    await magicLinkModel.store.create(new MagicLink({
      id: '3' as Uuid,
      token: 'expired-token',
      userId: userId2,
      expires: pastDate
    }));
  });

  it('should get magic link by token', async () => {
    const magicLink = await magicLinkModel.getByToken('valid-token-1');
    expect(magicLink).not.toBeNull();
    expect(magicLink?.token).toBe('valid-token-1');
    expect(magicLink?.userId).toBe(userId1);
  });

  it('should return null for non-existent token', async () => {
    const magicLink = await magicLinkModel.getByToken('non-existent-token');
    expect(magicLink).toBeNull();
  });

  it('should get all magic links by userId', async () => {
    const magicLinks = await magicLinkModel.getByUserId(userId1);
    expect(magicLinks).toHaveLength(2);
    expect(magicLinks.map(ml => ml.token)).toContain('valid-token-1');
    expect(magicLinks.map(ml => ml.token)).toContain('valid-token-2');
  });

  it('should return empty array when no magic links found for userId', async () => {
    const nonExistentUserId: Uuid = 'non-existent-user';
    const magicLinks = await magicLinkModel.getByUserId(nonExistentUserId);
    expect(magicLinks).toHaveLength(0);
  });

  it('should validate a valid token', async () => {
    const isValid = await magicLinkModel.isValid('valid-token-1');
    expect(isValid).toBe(true);
  });

  it('should invalidate an expired token', async () => {
    const isValid = await magicLinkModel.isValid('expired-token');
    expect(isValid).toBe(false);
  });

  it('should invalidate a non-existent token', async () => {
    const isValid = await magicLinkModel.isValid('non-existent-token');
    expect(isValid).toBe(false);
  });
});
