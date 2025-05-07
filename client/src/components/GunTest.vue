<template>
  <div>
    <p>Interests:</p>
    <span v-for="interest of interests" class="mx-2">
      {{interest.interests}}
    </span>

    <p>--------</p>
    <input
      placeholder="Interest title"
    />
    <button @click="createInterest">Save</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gun from '@/services/gun'

const interests = ref([])
const newInterest = ref('')

const chat = gun.get('interests')

const relations = async (interest: Object) => {
  if (interest.interests) {
    gun.get(interest.interests).map((value, key) => {
      console.log(key, value);
      gun.get('test1/Football').map((x, y) => console.log(x, y))
    });
  }
}

const getInterest = async (value: string) => {
  return new Promise((resolve, reject) => {
    gun.get('test1').get(value).once((ack) => {
      resolve(ack);
    });
  });
}

const createInterest = async () => {
  const newInterests = ['Soccer', 'Football', 'Swimming', 'Coding', 'Surfing'];
  for (let interest of newInterests) {
    gun.get('test1')
    .get(interest)
    .put({
      id: interest,
      title: interest,
    })
  }
  const football = await getInterest('Football');
  console.log(football);
  
  gun.get('test1')
  .get('Soccer')
  .get('interests')
  .get('likes')
  .set(football)
}

onMounted(async () => {
  var data = JSON.stringify({
    id: 'teach',
    active: 'teaches',
    passive: 'is teaching',
    color: 'yellow',
    icon: 'study',
  });
  var hash = await SEA.work(data, null, null, {name: 'SHA-256'});
  console.log(hash);

  gun.get('#relations').get(hash).put(data);
  gun.get('#relations').map().once(data => {
    console.log(JSON.parse(data))
  });
});
</script>
