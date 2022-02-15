import ffmpeg
input = ffmpeg.input('./contests/1/voices/07e5e258-9491-4b3d-b325-6ca074cceb79.mp4')
output = ffmpeg.output(input,'./contests/1/voices/07e5e258-9491-4b3d-b325-6ca074cceb79.mp3')
output.run()
