export default (request = fetch) => ({
  postJson: async (content) => {
    const result = await request(`api/${content.type}`, {
      method: 'POST',
      body: JSON.stringify(content),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });

    return {
      ok: result.ok,
    };
  },
});
