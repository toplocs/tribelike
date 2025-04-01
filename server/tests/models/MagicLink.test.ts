import { beforeEach, describe, expect, it } from 'vitest';
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

  it('should validate a valid token', async () => {
    const userId = await magicLinkModel.consumeToken('valid-token-1');
    expect(userId).toBe(userId1);

    const consumedToken = await magicLinkModel.getByToken('valid-token-1');
    expect(consumedToken).toBeNull();
  });

  it('should invalidate an expired token', async () => {
    const userId = await magicLinkModel.consumeToken('expired-token');
    expect(userId).toBeNull();

    const consumedToken = await magicLinkModel.getByToken('expired-token');
    expect(consumedToken).toBeNull();
  });

  it('should invalidate a non-existent token', async () => {
    const userId = await magicLinkModel.consumeToken('non-existent-token');
    expect(userId).toBeNull();
  });

  it('should create a new magic link', async () => {
    const newUserId: Uuid = 'new-user';
    const newMagicLink = await magicLinkModel.create({ userId: newUserId });
    expect(newMagicLink).not.toBeNull();
    expect(newMagicLink!.userId).toBe(newUserId);
    expect(newMagicLink!.token).toBeDefined();
    expect(newMagicLink!.expires).toBeInstanceOf(Date);
    expect(newMagicLink!.expires.getTime()).toBeGreaterThan(Date.now());
  });

  it('should delete expired links', async () => {
    // Verify we have an expired link before cleaning up
    const beforeCleanup = await magicLinkModel.getByToken('expired-token');
    expect(beforeCleanup).not.toBeNull();
    
    // Delete expired links
    const deletedCount = await magicLinkModel.cleanExpiredLinks();
    expect(deletedCount).toBe(1);
    
    // Verify the expired link was deleted
    const afterCleanup = await magicLinkModel.getByToken('expired-token');
    expect(afterCleanup).toBeNull();
    
    // Verify valid links remain
    const validLink = await magicLinkModel.getByToken('valid-token-1');
    expect(validLink).not.toBeNull();
  });
});
