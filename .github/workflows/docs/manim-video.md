name: CI
on: push
jobs:
  render-video:
    name: Render video (${{ matrix.name }})
    strategy:
      matrix:
        include:
          - name: main-result
            file: main_result
          - name: benedikt
            file: animation
          - name: introduction
            file: introduction
          - name: paulina
            file: paulinas_scenes
          - name: horodisks
            file: horodisks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: teatimeguest/setup-texlive-action@9855afe404b85dff721b382b9b50337e2dc252bd
        with:
          packages: |
            scheme-basic
            mathtools
            standalone
            preview
            dvisvgm
      - uses: prefix-dev/setup-pixi@19b5e6071f70a82d3c5741d7b3f98a71d192eb20
      - name: Render Scenes
        run: |
          pixi run ci-render-${{ matrix.name }}
      - name: Save output as artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.name }}
          path: |
            media/videos/${{ matrix.file }}/1440p60/*.mp4
            media/videos/${{ matrix.file }}/1440p60/*.srt
          retention-days: 5
          
