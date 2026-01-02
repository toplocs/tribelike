import { ref, computed, inject, provide, onMounted, onUnmounted, watchEffect } from 'vue';
import gun from '@/services/gun';
import type { CommentWithVotes } from '@/types';

interface Statistics {
  totalComments: number;
  totalSpheres: number;
  totalRelations: number;
  totalVotesReceived: number;
}

interface ProfileSphere {
  id: string;
  title?: string;
  type?: string;
  image?: string;
  relationType?: string;
}

export function profileActivityProvider(profileId: string) {
  const recentComments = ref<CommentWithVotes[]>([]);
  const sphereMemberships = ref<ProfileSphere[]>([]);
  const statistics = ref<Statistics>({
    totalComments: 0,
    totalSpheres: 0,
    totalRelations: 0,
    totalVotesReceived: 0,
  });
  const loading = ref(true);
  const error = ref<string | null>(null);

  let commentListener: any = null;
  let sphereListener: any = null;
  let voteCache = new Map<string, number>();

  /**
   * Load all comments authored by this profile across all spheres
   */
  const loadRecentComments = async (limit: number = 10) => {
    try {
      loading.value = true;
      error.value = null;

      // Clean up old listeners completely
      if (commentListener) {
        commentListener.off();
        commentListener = null;
      }

      recentComments.value = [];
      voteCache.clear();

      console.log('📂 Loading comments for profile:', profileId);

      // Use .once() to avoid continuous listening overhead
      commentListener = gun.get('spheres').once((spheresData: any) => {
        if (!spheresData) {
          loading.value = false;
          return;
        }

        const sphereIds = Object.keys(spheresData).filter(key => !key.startsWith('_'));

        if (sphereIds.length === 0) {
          loading.value = false;
          return;
        }

        let loadedSpheres = 0;

        // For each sphere, load its comments once
        sphereIds.forEach((sphereId) => {
          gun
            .get(`sphere/${sphereId}`)
            .get('comments')
            .map()
            .once(async (commentData: any) => {
              if (!commentData || !commentData.id) return;

              // Only include comments by this profile
              if (commentData.authorId !== profileId) return;

              // Load vote count for this comment
              const voteCount = await loadVoteCounts(commentData.id);

              const commentWithVotes: CommentWithVotes = {
                id: commentData.id,
                text: commentData.text,
                authorId: commentData.authorId,
                sphereId: commentData.sphereId,
                parentId: commentData.parentId,
                createdAt: commentData.createdAt,
                voteCount,
                userVote: null,
                replyCount: 0,
              };

              // Check if already in local state, update or add
              const existingIndex = recentComments.value.findIndex(c => c.id === commentData.id);
              if (existingIndex >= 0) {
                recentComments.value[existingIndex] = commentWithVotes;
              } else {
                recentComments.value.push(commentWithVotes);
              }

              // Sort by vote count descending, limit results
              recentComments.value.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
              if (recentComments.value.length > limit) {
                recentComments.value = recentComments.value.slice(0, limit);
              }

              updateStatistics();
            });

          loadedSpheres++;
        });

        // Mark loading complete after processing all spheres
        setTimeout(() => {
          loading.value = false;
        }, 500);
      });
    } catch (e) {
      error.value = `Failed to load comments: ${e}`;
      loading.value = false;
      console.error('Error loading comments:', e);
    }
  };

  /**
   * Load aggregated vote count for a comment
   */
  const loadVoteCounts = async (commentId: string): Promise<number> => {
    try {
      // Check cache first
      if (voteCache.has(commentId)) {
        return voteCache.get(commentId) || 0;
      }

      return new Promise((resolve) => {
        gun.get(`comment/${commentId}`).get('votes').once((votes: any) => {
          if (!votes) {
            resolve(0);
            return;
          }

          let totalVotes = 0;
          Object.keys(votes).forEach((key) => {
            const vote = votes[key];
            if (vote?.value) {
              totalVotes += vote.value;
            }
          });

          voteCache.set(commentId, totalVotes);
          resolve(totalVotes);
        });
      });
    } catch (e) {
      console.error(`Failed to load vote counts for ${commentId}:`, e);
      return 0;
    }
  };

  /**
   * Load sphere memberships for this profile (once, not continuous)
   * (spheres that this profile has relations to)
   */
  const loadSphereMemberships = async () => {
    try {
      // Clean up old listener
      if (sphereListener) {
        sphereListener.off();
        sphereListener = null;
      }

      sphereMemberships.value = [];

      console.log('🌍 Loading sphere memberships for profile:', profileId);

      // Query relations where this profile is 'one'
      // Use .once() to avoid continuous listening
      sphereListener = gun
        .get(`${profileId}`)
        .get('relations')
        .map()
        .once(async (relationData: any) => {
          if (!relationData || !relationData.two) return;

          // Load the sphere data for this relation's target
          gun.get(`sphere/${relationData.two}`).once((sphereData: any) => {
            if (!sphereData || !sphereData.id) return;

            const profileSphere: ProfileSphere = {
              id: sphereData.id,
              title: sphereData.title,
              type: sphereData.type,
              image: sphereData.image,
              relationType: relationData.type,
            };

            // Check if already in local state, update or add
            const existingIndex = sphereMemberships.value.findIndex(
              s => s.id === sphereData.id
            );
            if (existingIndex >= 0) {
              sphereMemberships.value[existingIndex] = profileSphere;
            } else {
              sphereMemberships.value.push(profileSphere);
            }

            updateStatistics();
          });
        });
    } catch (e) {
      error.value = `Failed to load sphere memberships: ${e}`;
      console.error('Error loading sphere memberships:', e);
    }
  };

  /**
   * Update statistics based on loaded data (simplified, local only)
   */
  const updateStatistics = () => {
    try {
      // Count sphere memberships (from local state)
      statistics.value.totalSpheres = sphereMemberships.value.length;

      // Count recent comments (from local state)
      statistics.value.totalComments = recentComments.value.length;

      // Sum vote counts from recent comments
      const totalVotes = recentComments.value.reduce(
        (sum, comment) => sum + (comment.voteCount || 0),
        0
      );
      statistics.value.totalVotesReceived = totalVotes;

      // Count total relations for this profile (once, not continuous)
      gun
        .get(`${profileId}`)
        .get('relations')
        .once((relationsData: any) => {
          if (relationsData) {
            const relations = Object.values(relationsData).filter((r: any) => r && typeof r === 'object' && !r._);
            statistics.value.totalRelations = relations.length;
          }
        });
    } catch (e) {
      console.error('Error updating statistics:', e);
    }
  };

  /**
   * Clear all listeners and reset state
   */
  const clear = () => {
    if (commentListener) {
      commentListener.off();
      commentListener = null;
    }
    if (sphereListener) {
      sphereListener.off();
      sphereListener = null;
    }
    recentComments.value = [];
    sphereMemberships.value = [];
    voteCache.clear();
    error.value = null;
  };

  /**
   * Lifecycle cleanup
   */
  onUnmounted(() => {
    clear();
  });

  /**
   * Initialize loading on mount
   */
  onMounted(() => {
    loadRecentComments();
    loadSphereMemberships();
  });

  // Provide for children
  provide('profileActivity', {
    recentComments,
    sphereMemberships,
    statistics,
    loading,
    error,
    loadRecentComments,
    loadSphereMemberships,
    updateStatistics,
  });

  return {
    recentComments,
    sphereMemberships,
    statistics,
    loading,
    error,
    loadRecentComments,
    loadSphereMemberships,
    updateStatistics,
  };
}

/**
 * Composable consumer
 */
export function useProfileActivity() {
  const data = inject<any>('profileActivity');
  if (!data) {
    throw new Error('Composable must have a profileActivity provider.');
  }
  return data;
}
