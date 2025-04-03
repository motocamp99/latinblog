export default eventHandler(async (event) => {

    //const { slug } = getRouterParams(event)
    const page = await queryCollection(event, 'content').all()

    return page
  })