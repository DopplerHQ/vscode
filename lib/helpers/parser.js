class DopplerParser {
  fromReference(reference, uri) {
    const uriIDs = this.fromURI(uri);
    const parts = reference.split(".");

    switch (parts.length) {
      case 1:
        return {
          project: uriIDs.project,
          config: uriIDs.config,
          secret: parts[0],
        };

      case 2:
        return { project: uriIDs.project, config: parts[0], secret: parts[1] };

      case 3:
        return { project: parts[0], config: parts[1], secret: parts[2] };
    }
  }

  fromURI(uri) {
    const parts = uri.path.slice(1).split("/");

    return {
      project: parts[0],
      config: parts[2],
    };
  }
}

module.exports = DopplerParser;
