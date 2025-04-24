import CryptoJS from 'crypto-js';
import { ref, inject, provide, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import gun from '@/services/gun';

export function interestProvider() {
  const interest = ref<Interest | null>(null);
  const relations = ref<Relation | null>(null);
  //const route = useRoute();

  const getInterest = async (title: string) => {
    return new Promise((resolve, reject) => {
      gun.get(`interest.${title}`).once((interest) => {
        if (!interest) {
          reject('Interest not found.');
        } else {
          resolve(interest);
        }
      });
    });
  }

  const setInterest = async (formData: FormData) => {
    try {
      const interestId = formData.get('interestId');
      const { data } = await axios.put(`/api/interest/${interestId}`, {
        
      });

      return data;
    } catch (e) {
      console.error(e);
    }
  }

  const createInterest = async (
    interest: Interest,
    profile: Profile
  ) => {
    return new Promise((resolve, reject) => {
      const relation = interest.relation;
      interest.id = crypto.randomUUID();
      gun.get('interests')
      .get(interest.title)
      .set(interest)
    });
  }

  const createRelation = (key, profile, interest) => {
    relations.value.push({
      key: key,
      from: id,
      to: interest.value.id,
    });

    const linkId = uuid();

    const review = db.get(linkId).put({ // A
      uuid: linkId,
      type: "Link",
      name: "review_book",
      rating: rating,
      content: content,
    });
    review.get("book").put(book); // B
    review.get("reader").put(reader); // C

    db.get(`reviews/${rating}`).set(review); // D

    book.get("reviews").set(review); // E
    reader.get("book_reviews").set(review); // F

    return review;
  }

  onMounted(() => {
    gun.get('interests')
    .get(interest.id) //title?
    .once((data) => {
      console.log(data);
      interest.value = data;
    });
  });

  provide('interest', {
    interest,
    getInterest,
    setInterest,
    createInterest,
  });
}

export function useInterest() {
  const data = inject('interest');

  if (!data) {
    throw new Error('Composable must have an interest provider.');
  }

  return data;
}