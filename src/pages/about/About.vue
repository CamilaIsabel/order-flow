<script setup lang="ts"></script>

<template>
  <div class="p-8">
    <div class="flex justify-between w-full items-center">
      <span class="text-white font-bold text-base">About me</span>
      <div class="flex gap-x-2">
        <a
          href="https://github.com/CamilaIsabel"
          target="_blank"
          class="flex items-center justify-center future-buttons rounded-lg p-1 text-white font-bold text-xs shadow-sm hover:bg-white hover:bg-opacity-55"
        >
          <IconGithub class="h-5 w-5" />
        </a>

        <a
          href="https://www.linkedin.com/in/camila-lazaro/"
          target="_blank"
          class="flex items-center justify-center future-buttons rounded-lg p-1 text-white font-bold text-xs shadow-sm hover:bg-white hover:bg-opacity-55"
        >
          <IconLinkedin class="h-5 w-5" />
        </a>
      </div>
    </div>
    <div class="w-full mt-6">
      <span class="text-gray-400 font-medium text-sm"
        >Hello! I'm Camila, a passionate Front End Developer with an innate love
        for programming, design, and the constant pursuit of excellence in every
        project I undertake.<br /><br />From an early age, I discovered my
        fascination with the digital world and its ability to transform ideas
        into tangible experiences. With a solid background in web development
        and a special focus on creating intuitive and visually appealing
        interfaces, I have cultivated technical and creative skills that allow
        me to translate complex concepts into functional and aesthetically
        pleasing solutions.</span
      >
    </div>
    <img
      src="../../assets/decoration/computer.gif"
      alt="Descripción del GIF"
      class="w-40 h-40"
    />
  </div>
</template>
