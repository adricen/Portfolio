<template>
    <div class="hud-container"> 
        <h1>Test de titre</h1>
        <slot />
    </div>
</template>

<style scoped>
.hud-container {
    position: fixed;
    width: calc(100% - 20px );
    height: calc(100% - 20px );
    left: 10px;
    top: 10px;
    border: 2px solid red;
}
</style>