import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    BloomPlugin,
    DiamondPlugin,
    mobileAndTabletCheck,
    GammaCorrectionPlugin,

    // addBasePlugins,
    CanvasSnipperPlugin,
    MeshStandardMaterial2,
    Color,
    AssetImporter,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false,
    })

    const isMobile = mobileAndTabletCheck()
    console.log(isMobile)

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target
    const exitButton = document.querySelector(".button--exit") as HTMLElement
    const customizerInterface = document.querySelector(".customizer--container") as HTMLElement

    // Add a popup(in HTML) with download progress when any asset is downloading.
    // await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(BloomPlugin)
    await viewer.addPlugin(DiamondPlugin)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    //LOADER
    const importer = manager.importer as AssetImporter

    importer.addEventListener("onProgress", (event) => {
        const progressRatio = (event.loaded / event.total)
        console.log(progressRatio)
        document.querySelector('.progress')?.setAttribute('style', `transform: scaleX(${progressRatio})`)
    })

    importer.addEventListener("onLoad", (event) => {
        gsap.to('.loader', {opacity: 0, delay: 1, onComplete: () =>{
            document.body.style.overflowY = 'auto'
        }})
    })

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    // Import and add a GLB file.
    await viewer.load("./assets/rose1.glb")

    console.log(viewer.scene.modelObject.position)

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

    if(isMobile) {
        position.set(9.32, 0.523, 0.2)
        target.set(-1.21, 0.87, -0.027)
        camera.setCameraOptions({fov: 30})
    }

    window.scrollTo(0, 0)
    
    function setupScrollanimation() {

        const tl = gsap.timeline();

        // First to second

        tl
        .to(position, {x: isMobile ? 0.174 : -6.1, y: isMobile ? 11.2 : 1.93, z: isMobile ? -0.088 : -1,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }, onUpdate})

        .to(".section--one--container", { yPercent:'-10' , opacity: 0,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "top 90%", scrub: 1,
                immediateRender: false
        }})
        .to(target, {x: isMobile ? 0.174 : -0.49, y: isMobile ? 0.2935 : 0.275 , z: isMobile ? -0.088 : 0.94,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})

        // Second to third

        .to(position, {x: isMobile ? -4.88 : -4, y: isMobile ? 2.54 : 2.51, z: isMobile ? 4.66 : 5.57,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }, onUpdate})

        .to(".section--two--container", { yPercent:'-10' , opacity: 1,
        scrollTrigger: {
            trigger: ".second",
            start:"top center",
            end: "top 10%", scrub: 1,
            immediateRender: false
        }})

        .to(target, {x: isMobile ? -0.68 : -0.19, y:  isMobile ? 0.635 : 0.61 , z: isMobile ? 0.57 : 1.49,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})

                // Third to forth

                .to(position, {x: isMobile ? -0.73 : 0.37, y: isMobile ? 6.9 : 6.9, z: isMobile ? 1.5 : 2,
                    scrollTrigger: {
                        trigger: ".forth",
                        start:"top bottom",
                        end: "top top", scrub: true,
                        immediateRender: false
                }, onUpdate})

                .to(".section--third--container", { yPercent:'-10' , opacity: 1,
                scrollTrigger: {
                    trigger: ".third",
                    start:"top center",
                    end: "top 10%", scrub: 1,
                    immediateRender: false
                }})
        
                .to(target, {x: isMobile ? -0.0165 : 1.08, y: isMobile ? 0.979 : 0.98 , z: isMobile ? -0.03 : 0.465,
                    scrollTrigger: {
                        trigger: ".forth",
                        start:"top bottom",
                        end: "top top", scrub: true,
                        immediateRender: false
                }})

                .to(".section--forth--container", { yPercent:'-10' , opacity: 1,
                scrollTrigger: {
                    trigger: ".forth",
                    start:"top center",
                    end: "top 10%", scrub: 1,
                    immediateRender: false
                }})

                .to(".section--fifth--container", { yPercent:'-10' , opacity: 1,
                scrollTrigger: {
                    trigger: ".fifth",
                    start:"top center",
                    end: "top 10%", scrub: 1,
                    immediateRender: false
                }})
    }

    setupScrollanimation();

    //WEBGI UPDATE

    let needsUpdate = true;

    function onUpdate() {
        needsUpdate = true;
        viewer.renderer.resetShadows()
    }

    viewer.addEventListener("preFrame", () => {
        if( needsUpdate ) {
            camera.positionUpdated(true);
            camera.targetUpdated(true);
            needsUpdate = false;
        }
    })

	// SCROLL TO TOP
	document.querySelectorAll('.button--footer')?.forEach(item => {
		item.addEventListener('click', () => {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		})
	})

    // VIEW MORE
	document.querySelectorAll('.view-more')?.forEach(item => {
		item.addEventListener('click', () => {
			window.scrollTo({ top: 2000, left: 0, behavior: 'smooth' })
		})
	})

}

setupViewer()
