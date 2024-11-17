const getSelectedContentType = (contentTypes, uid) => {
  const selectedContentType = contentTypes.filter(
    (type) => type.uid === uid,
  )[0];

  return selectedContentType;
};

export default getSelectedContentType;
