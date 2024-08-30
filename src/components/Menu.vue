<template>
    <div class="navbar">
        <div class="logo">VUE3</div>
        <div class="menu">
            <slot></slot>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'Menu',
    computed: {
    },
    methods: {
    }
}
</script>
  
<style >
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2563eb;
    padding: 10px 20px;
    color: white;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
}

.navbar a {
    color: white;
    text-decoration: none;
    padding: 14px 20px;
    display: block;
}

.navbar a:hover {
    background-color: #93c5fd;
    border-radius: 4px;
    color: #1e40af;
}

.navbar .logo {
    font-size: 1.5em;
    font-weight: bold;
    margin-left: 1.5em;
}

.navbar .menu {
    display: flex;
    padding-right: 20px;
}

.navbar .menu-item {
    margin-left: 10px;
}

</style>
  