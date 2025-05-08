require("video.min.js");
require("RecordRTC.js");
require("adapter.js");
require("wavesurfer.min.js");
require("wavesurfer.microphone.min.js");
require("videojs.wavesurfer.min.js");
require("videojs.record.min.js");
require("lang/fr.js");
require("videojs.record.vmsg.min.js");
const { deferLoadingScript } = require("DeferLoadingScript.js");
const IEHtml = require("IEHtml.js");
const { GUID } = require("GUID.js");
IEHtml.addBalise("ie-videojs", (aContexteCourant, aOutils) => {
  const lId =
      aContexteCourant.node && aContexteCourant.node.id
        ? aContexteCourant.node.id
        : GUID.getId(),
    lDebug = true,
    lInfosApi = aOutils.getAccesParametresModel("api", aContexteCourant),
    lInfosGetOptions = aOutils.getAccesParametresModel(
      "getOptions",
      aContexteCourant,
    ),
    lInfosFinishRecordCallback = aOutils.getAccesParametresModel(
      "getFinishRecordCallback",
      aContexteCourant,
    ),
    lJqDivConteneur = $(
      '<video id="' +
        lId +
        '" class="video-js vjs-skin-colors-pronote" controls preload="auto"><p class="vjs-no-js"><a href="https://videojs.com/html5-video-support/" target="_blank"></a></p></video>',
    ),
    lDivConteneur = lJqDivConteneur.get(0);
  let lPlayer = null;
  let lOptions = {
    controls: true,
    controlBar: {
      children: [
        "playToggle",
        "volumePanel",
        "currentTimeDisplay",
        "timeDivider",
        "durationDisplay",
        "progressControl",
        "image",
      ],
    },
    liveui: true,
    bigPlayButton: false,
    loop: false,
    fluid: false,
    width: 320,
    height: 130,
    plugins: {
      record: {
        image: false,
        audio: true,
        video: false,
        maxLength: 5,
        debug: lDebug,
        audioEngine: "vmsg",
        audioWebAssemblyURL: "vmsg.wasm",
      },
    },
  };
  lJqDivConteneur.on("destroyed", () => {
    const lPlayerRecord = !!lPlayer && lPlayer.record();
    if (!!lPlayerRecord && !!lPlayerRecord.stopDevice) {
      lPlayerRecord.stopDevice();
    }
    if (lInfosApi.estFonction) {
      lInfosApi.callback([null]);
    }
  });
  const lApi = {
    getRecordedData: function () {
      return !!lPlayer && lPlayer.recordedData;
    },
    getDuration: function () {
      const lPlayerRecord = !!lPlayer && lPlayer.record();
      return (
        !!lPlayerRecord &&
        !!lPlayerRecord.getDuration &&
        lPlayerRecord.getDuration()
      );
    },
    getPlayer: function () {
      return lPlayer;
    },
  };
  const lInit = function () {
    if (lInfosGetOptions.estFonction) {
      const lOptionsPerso = lInfosGetOptions.callback();
      if (lOptionsPerso) {
        lOptions = videojs.mergeOptions(lOptions, lOptionsPerso);
      }
    }
    if (lOptions.plugins.record.audio && !lOptions.plugins.record.video) {
      lOptions.plugins.wavesurfer = {
        backend: "WebAudio",
        backgroundColor: "#ffffff",
        waveColor: "#222222",
        progressColor: "black",
        displayMilliseconds: true,
        debug: lDebug,
        cursorWidth: 1,
        hideScrollbar: true,
        plugins: [
          WaveSurfer.microphone.create({
            bufferSize: 4096,
            numberOfInputChannels: 1,
            numberOfOutputChannels: 1,
            constraints: { video: false, audio: true },
          }),
        ],
      };
    }
    lPlayer = videojs(lId, lOptions, () => {
      if (lDebug) {
        const msg =
          "Using video.js " +
          videojs.VERSION +
          " with videojs-record " +
          videojs.getPluginVersion("record") +
          ", videojs-wavesurfer " +
          videojs.getPluginVersion("wavesurfer") +
          ", wavesurfer.js " +
          WaveSurfer.VERSION +
          " and recordrtc " +
          RecordRTC.version;
        videojs.log(msg);
        console.log("videojs-record is ready!");
      }
      lPlayer.controlBar.getChild("playToggle").handlePause();
      setTimeout(() => {
        lPlayer.deviceButton.trigger("click");
        lPlayer.controlBar.getChild("playToggle").show();
      }, 200);
    });
    if (lInfosApi.estFonction) {
      lInfosApi.callback([lApi]);
    }
  };
  Promise.all([
    deferLoadingScript.loadAsync("videojs"),
    aOutils.surInjectionHtmlPromise(aContexteCourant),
  ]).then(() => {
    if (lPlayer === null) {
      lInit();
      lPlayer.on("finishRecord", () => {
        if (lInfosFinishRecordCallback.estFonction) {
          lInfosFinishRecordCallback.callback();
        }
        IEHtml.refresh();
      });
    }
  });
  aOutils.replaceNode(aContexteCourant.node, lDivConteneur);
  aOutils.addCommentaireDebug(lDivConteneur, "ie-videojs");
  aOutils.copyAttributs(aContexteCourant.node, lDivConteneur);
  return { node: aContexteCourant.node, avecCompileFils: false };
});
module.exports = IEHtml;
