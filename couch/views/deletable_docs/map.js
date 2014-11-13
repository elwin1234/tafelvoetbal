function(doc) {
  if(doc._id.indexOf("_") !== 0) {
    emit(doc._id, doc);
  }
}
