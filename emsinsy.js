Module = {
  TOTAL_MEMORY: 1024 * 1024 * 1024
};
onmessage = e => {
  postMessage({msg: "initialize"});
  fetch("nitech_jp_song070_f001.htsvoice").then(resp => resp.arrayBuffer()).then(voice => {
    let start;
    Module.preRun = [() => {
      FS.writeFile("input.xml", new Uint8Array(new FileReaderSync().readAsArrayBuffer(e.data)), {encoding: "binary"});
      FS.writeFile("voice.htsvoice", new Uint8Array(voice), {encoding: "binary"});
      Module.arguments.push("-x", "dic", "-m", "voice.htsvoice", "-o", "output.wav", "input.xml");
      postMessage({msg: "rendering"});
      start = Date.now();
    }];
    Module.postRun = [() => {
      const u8a = FS.readFile("output.wav", {encoding: "binary"});
      postMessage({msg: "complete", buffer: u8a.buffer, time: Date.now() - start}, [u8a.buffer]);
    }];
    importScripts("sinsy.js");
  });
};
