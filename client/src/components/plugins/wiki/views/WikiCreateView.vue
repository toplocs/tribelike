<template>
  <Container>
    <div class="w-full">
      <Card className="space-y-4">
        <Title>
          Creating a new wiki page:
        </Title>
        <form
          ref="form"
          @submit.prevent="onSubmit"
        >
          <Callout v-if="successMessage" color="green">
            {{ successMessage }}
          </Callout>
          <Callout v-if="errorMessage" color="red">
            {{ errorMessage }}
          </Callout>

          <div className="mb-2">
            <label
              for="title"
              class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
            > Wiki Page Title
            </label>

            <TextInput
              type="text"
              id="title"
              name="title"
              autoComplete="title"
              placeholder="The wiki page title"
            />
          </div>

          <div class="mb-8">
            <FindInterest
              :defaultInterests="interests"
              :hideSearch="false"
              :addInterest="addInterest"
              :removeInterest="removeInterest"
            />
          </div>

          <div class="mb-8">
            <FindLocation
              :defaultLocations="locations"
              :hideSearch="false"
              :addLocation="addLocation"
              :removeLocation="removeLocation"
            />
          </div>

          <WikiEdit v-model="content" />
    
          <div class="mt-2 space-x-2">
            <button
              type="submit"
              class="px-4 py-2 rounded font-semibold transition-colors duration-200 bg-green-500 hover:bg-green-600 text-white"
            > Save
            </button>
          </div>
        </form>
      </Card>
    </div>
  </Container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/common/Card.vue';
import Container from '@/components/common/Container.vue';
import Sidebar from '@/components/SideBar.vue';
import Title from '@/components/common/Title.vue';
import Callout from '@/components/common/Callout.vue';
import TextInput from '@/components/common/TextInput.vue';
import FindInterest from '@/components/search/FindInterest.vue';
import FindLocation from '@/components/search/FindLocation.vue';
import WikiEdit from '@/components/plugins/wiki/WikiEdit.vue';

const router = useRouter();
const profile = inject('profile');
const form = ref<HTMLFormElement | null>(null);
const interests = ref([]);
const locations = ref([]);
const successMessage = ref('');
const errorMessage = ref('');
const content = ref(
  `<h2>
      Welcome to the Wiki
    </h2>

    <p>
      This is a simple <em>wiki</em> page made for your <strong>text editor</strong>. It includes basic text styles that you would expect from any modern editor. But there’s more than just text. Take a look at the lists below:
    </p>

    <ul>
      <li>
        A standard bullet point …
      </li>
      <li>
        … with two items, just for fun.
      </li>
    </ul>

    <p>
      Pretty cool, right? But that’s not all! Here’s a code block for you to try:
    </p>

    <pre><code class="language-js">function greet() {
      console.log("Hello, world!");
    }</code></pre>

    <p>
      Nice, isn’t it? Don’t stop there, explore more features by trying out different options. Maybe even create some more code or lists of your own.
    </p>

    <blockquote>
      "This wiki page looks fantastic, keep up the good work!" 👏
      <br />
      — Your Mentor
    </blockquote>

  `
);

const addInterest = async (interest: Object) => {
  interests.value.push(interest)
}

const removeInterest = async (interest: Object) => {
  interests.value = interests.value.filter(
    x => x.id !== interest.id
  );
}

const addLocation = async (location: Object) => {
  locations.value.push(location)
}

const removeLocation = async (location: Object) => {
  locations.value = locations.value.filter(
    x => x.id !== location.id
  );
}

const onSubmit = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    formData.append('content', JSON.stringify(content.value));
    formData.append('interests', JSON.stringify(interests.value.map(x => ({id: x.id}))));
    formData.append('locations', JSON.stringify(locations.value.map(x => ({id: x.id}))));
    const response = await axios.post(`/api/plugins/wiki`, formData);
    successMessage.value = 'Wiki content was saved successfully!';
    
    return response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}
</script>
