module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    client.user.setActivity('made and hosted by forrealrob dm him', { type: 3 }); // 3 = Watching
  },
};
