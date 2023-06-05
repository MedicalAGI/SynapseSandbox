export const getNodes = (content: any[] | undefined, template) => content?.map(item => item.reduce(
  (prev, curr) => {
    if (curr?.key === 'template') {
      const templateKey = curr?.value?.join('/')
      return ({ ...prev, [curr?.key]: template?.[templateKey] })
    } else return ({ ...prev, [curr?.key]: curr?.value })
  }, {}))
