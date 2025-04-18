import gun from '@/services/gun';


const addInterest = async (selected: Object) => {
  //new global interest?
  console.log(selected)
  listener.value
  .get('interests')
  .get('likes')
  .get(selected.title)
  .put({
    id: 'testInterestId',
    title: selected.title
  });
}

const newInterest = async (title: String) => {
  listener.value
  .get('interests')
  .get('likes')
  .get(title)
  .put({
    id: 'testInterestId',
    title: title
  });
}

const removeInterest = (title: String) => {
  interests.value = props.values.filter(x => x.title !== title);
  listener.value
  .get('interests')
  .get('likes')
  .get(title)
  .put(null);
}

onMounted(() => {
  gun.get('interests')
  .map()
  .once((interest) => {
    options.value.push(interest);
  });
});

onUnmounted(() => {
  gun.get('interests')
  .map()
  .off();
});
</script>
