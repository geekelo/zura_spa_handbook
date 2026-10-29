function writeString(view, offset, value) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i))
  }
}

function audioBufferToWav(buffer) {
  const sampleRate = buffer.sampleRate
  const length = buffer.length
  const channelCount = buffer.numberOfChannels
  const samples = new Float32Array(length)

  for (let i = 0; i < length; i += 1) {
    let sum = 0
    for (let channel = 0; channel < channelCount; channel += 1) {
      sum += buffer.getChannelData(channel)[i]
    }
    samples[i] = sum / channelCount
  }

  const wav = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(wav)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, samples.length * 2, true)

  let offset = 44
  for (let i = 0; i < samples.length; i += 1, offset += 2) {
    const sample = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
  }

  return wav
}

export async function blobToWavFile(blob, fileName) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) throw new Error('No AudioContext')

  const context = new AudioCtx()
  try {
    const data = await blob.arrayBuffer()
    const audioBuffer = await context.decodeAudioData(data.slice(0))
    return new File([audioBufferToWav(audioBuffer)], fileName, {
      type: 'audio/wav',
    })
  } finally {
    await context.close().catch(() => {})
  }
}
