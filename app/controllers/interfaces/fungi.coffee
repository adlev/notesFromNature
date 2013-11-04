Archive = require 'models/Archive'
Interfaces = require 'controllers/interfaces'

Classification = require 'zooniverse/models/classification'
Subject = require 'zooniverse/models/subject'

class Fungi extends Interfaces
  className: 'fungi-interface'
  template: require 'views/transcription/fungi'
  modules: ['eol']

  nextSubject: =>
    species = Subject.current.metadata.species || "mushroom"

    @eol.query species
    @classification = new Classification subject: Subject.current

    callback = =>
      $(".photos img").animate({ marginLeft: "0" }, 500)
      @transcriber.$backgroundMessage.fadeOut 250, =>
        @transcriber.$backgroundMessage.html("")

      @transcriber.spinner.hide()
      @transcriber.startTranscribing(Subject.current)

    @transcriber.loadPhoto(Subject.current.location.standard, callback)
    @transcriber.loadLargePhoto(Subject.current.location.standard)

module.exports = Fungi
