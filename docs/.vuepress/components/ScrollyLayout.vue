<template>
  <div class="scrolly-layout">
    <header>Scroll down<br>&#8595;</header>
    <Content></Content>
    <footer>&#8593;<br>Scroll up</footer>
  </div>
</template>

<style lang="scss">
.scrolly-layout {
  & > header,
  & > footer {
    height: 100vh;
    background-color: #222;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 2em;
  }

  .slide {
    height: 800px;
  }

  .card {
    display: inline-block;
    float: right;
    width: 100%;
    max-width: 200px;
    height: 100px;
    padding: 0 10%;
    background-color: white;
    color: black;
    font-weight: 400;
    text-align: center;
    line-height: 100px;
    border-radius: 12px;
    border: 1px dotted black;
  }

  .centered {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    font-weight: 700;
    color: white;
  }

  * {
    box-sizing: border-box;
  }
}
</style>