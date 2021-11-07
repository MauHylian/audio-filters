export default function createBitCrusher(audioContext) {
  var bufferSize = 4096;
  var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
  node.bits = 4; // between 1 and 16
  node.normfreq = 0.1; // between 0.0 and 1.0
  var step = Math.pow(1 / 2, node.bits);
  var phaser = 0;
  var last = 0;
  node.onaudioprocess = function (e) {
    var input = e.inputBuffer.getChannelData(0);
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      phaser += node.normfreq;
      if (phaser >= 1.0) {
        phaser -= 1.0;
        last = step * Math.floor(input[i] / step + 0.5);
      }
      output[i] = last;
    }
  };
  return node;
}
