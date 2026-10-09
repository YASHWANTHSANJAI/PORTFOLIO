import { useEffect } from 'react';
import './index.css';
import Header from './components/Header';
import ChapterRail from './components/ChapterRail';
import Hero from './components/Hero';
import Story from './components/Story';
import Arsenal from './components/Arsenal';
import Achievements from './components/Achievements';
import Showcase from './components/Showcase';
import Momentum from './components/Momentum';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import Toast from './components/Toast';

export default function App() {
  useEffect(() => {

    document.getElementById('year').textContent = new Date().getFullYear();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let mobileMode = window.matchMedia('(max-width: 680px)').matches;
    window.matchMedia('(max-width: 680px)').addEventListener('change',event=>{mobileMode=event.matches;});
    const topbar = document.getElementById('topbar');
    const root = document.documentElement;
    const railPercent=document.getElementById('rail-percent');
    function updateScrollProgress(){
      const max=document.documentElement.scrollHeight-window.innerHeight;
      const progress=max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0;
      root.style.setProperty('--scroll-progress',progress+'%');
      root.style.setProperty('--chapter-scroll',progress+'%');
      railPercent.textContent=String(Math.round(progress)).padStart(2,'0')+'%';
      topbar.classList.toggle('scrolled',window.scrollY>24);
    }
    window.addEventListener('scroll',updateScrollProgress,{passive:true});
    window.addEventListener('resize',updateScrollProgress,{passive:true});
    updateScrollProgress();

    // A small orbital cursor follows a mouse or trackpad and labels interactive areas.
    const pointerFine=window.matchMedia('(hover: hover) and (pointer: fine)');
    const cursorHalo=document.querySelector('.cursor-halo'),cursorLabel=cursorHalo.querySelector('.cursor-label');
    let cursorTargetX=-100,cursorTargetY=-100,cursorRingX=-100,cursorRingY=-100,cursorFrame=0;
    function syncCursor(){
      const enabled=pointerFine.matches&&!mobileMode&&!reducedMotion;
      document.body.classList.toggle('cursor-enabled',enabled);
      if(!enabled)cursorHalo.classList.remove('is-active');
    }
    function animateCursor(){
      cursorFrame=0;cursorRingX+=(cursorTargetX-cursorRingX)*.19;cursorRingY+=(cursorTargetY-cursorRingY)*.19;
      root.style.setProperty('--cursor-ring-x',cursorRingX+'px');root.style.setProperty('--cursor-ring-y',cursorRingY+'px');
      if(Math.abs(cursorTargetX-cursorRingX)+Math.abs(cursorTargetY-cursorRingY)>.25)cursorFrame=requestAnimationFrame(animateCursor);
    }
    syncCursor();
    window.matchMedia('(max-width: 680px)').addEventListener('change',syncCursor);
    pointerFine.addEventListener('change',syncCursor);
    window.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch')return;
      root.style.setProperty('--pointer-x',event.clientX+'px');root.style.setProperty('--pointer-y',event.clientY+'px');
      root.style.setProperty('--cursor-x',event.clientX+'px');root.style.setProperty('--cursor-y',event.clientY+'px');
      cursorTargetX=event.clientX;cursorTargetY=event.clientY;
      if(document.body.classList.contains('cursor-enabled')&&!cursorFrame)cursorFrame=requestAnimationFrame(animateCursor);
    },{passive:true});
    document.addEventListener('pointerover',event=>{
      const target=event.target.closest('a,button,input,textarea,.skill-tag,.timeline-card,.project-card');
      if(!target||!document.body.classList.contains('cursor-enabled'))return;
      cursorHalo.classList.add('is-active');cursorLabel.textContent=target.dataset.cursorLabel||(target.matches('input,textarea')?'TYPE':target.matches('a,button')?'OPEN':'EXPLORE');
    });
    document.addEventListener('pointerout',event=>{
      if(event.target.closest('a,button,input,textarea,.skill-tag,.timeline-card,.project-card')&&!event.relatedTarget?.closest('a,button,input,textarea,.skill-tag,.timeline-card,.project-card'))cursorHalo.classList.remove('is-active');
    });

    // Glass panels and cards receive a local glow and a tiny pointer tilt.
    document.querySelectorAll('.story-panel,.project-card,.skill-group,.timeline-card,.featured').forEach(surface=>{
      surface.addEventListener('pointermove',event=>{
        if(event.pointerType==='touch'||!pointerFine.matches||mobileMode)return;
        const rect=surface.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
        surface.style.setProperty('--spot-x',(x*100)+'%');surface.style.setProperty('--spot-y',(y*100)+'%');surface.style.setProperty('--spot-alpha','.13');
        surface.style.rotate=((x-.5)*2.2)+'deg';
      },{passive:true});
      surface.addEventListener('pointerleave',()=>{surface.style.setProperty('--spot-alpha','0');surface.style.rotate='0deg';});
    });

    // Title: letter-by-letter. Supporting line: word-by-word.
    document.querySelectorAll('[data-type-line]').forEach((line,lineNo)=>{
      const words=line.dataset.typeLine.split(' ');let charIndex=0;
      words.forEach((word,wordIndex)=>{
        const group=document.createElement('span');group.className='type-word';
        [...word].forEach(char=>{const span=document.createElement('span');span.className='letter';span.textContent=char;span.style.setProperty('--char-delay',(220+lineNo*370+charIndex*37)+'ms');charIndex++;group.appendChild(span);});
        line.append(group);if(wordIndex<words.length-1)line.append(document.createTextNode(' '));
      });
    });
    const sub=document.getElementById('hero-subtext'),subText=sub.textContent;sub.textContent='';subText.split(/\s+/).forEach((word,i)=>{const span=document.createElement('span');span.className='word';span.textContent=word;span.style.setProperty('--word-delay',(1000+i*32)+'ms');sub.append(span,document.createTextNode(' '));});
    const footerText=document.getElementById('typed-footer').textContent;document.getElementById('typed-footer').textContent='';[...footerText].forEach((ch,i)=>setTimeout(()=>document.getElementById('typed-footer').append(ch),1800+i*45));

    // Chapter reveals, timeline moments, and animated chapter markers.
    const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible','visible');revealObserver.unobserve(entry.target);}});},{threshold:.13});
    document.querySelectorAll('.reveal,.profile-scene,.timeline-card,.project-card,.momentum').forEach(el=>revealObserver.observe(el));
    const chapterSections=[...document.querySelectorAll('main section[id]')];
    const railLinks=[...document.querySelectorAll('.chapter-rail a')];
    const sectionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){railLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));}});},{rootMargin:'-40% 0px -45% 0px'});
    chapterSections.forEach(section=>sectionObserver.observe(section));

    // Lightweight hero parallax: reduced on tablets and disabled on touch/reduced-motion devices.
    const parallaxLayers=[...document.querySelectorAll('[data-parallax-speed]')];
    const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
    let parallaxFrame=0;
    function updateParallax(){
      parallaxFrame=0;
      if(reducedMotion||mobileMode||!finePointer.matches){parallaxLayers.forEach(layer=>layer.style.translate='');return;}
      const intensity=window.innerWidth<=900 ? 0.5 : 1;
      parallaxLayers.forEach(layer=>{
        const speed=Number(layer.dataset.parallaxSpeed)||1;
        const offset=Math.max(-90,Math.min(90,window.scrollY*(1-speed)*intensity));
        layer.style.translate=`0px ${offset}px`;
      });
    }
    window.addEventListener('scroll',()=>{if(!parallaxFrame)parallaxFrame=requestAnimationFrame(updateParallax);},{passive:true});
    window.addEventListener('resize',updateParallax,{passive:true});
    window.matchMedia('(max-width: 680px)').addEventListener('change',updateParallax);
    finePointer.addEventListener('change',updateParallax);
    updateParallax();

    // Count small profile facts into view, and respect reduced-motion settings.
    const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const counter=entry.target,target=Number(counter.dataset.count)||0;
      if(reducedMotion){counter.textContent=String(target);counterObserver.unobserve(counter);return;}
      const started=performance.now(),duration=1800;
      function countFrame(now){
        const progress=Math.min(1,(now-started)/duration);
        const eased=1-Math.pow(1-progress,3);
        counter.textContent=String(Math.round(target*eased));
        if(progress<1)requestAnimationFrame(countFrame);
      }
      requestAnimationFrame(countFrame);counterObserver.unobserve(counter);
    }),{threshold:.55});
    document.querySelectorAll('[data-count]').forEach(counter=>counterObserver.observe(counter));

    // Mobile navigation: three lines animate into a close icon.
    const menuButton=document.getElementById('menu-toggle'),menu=document.getElementById('nav-links');
    menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation');menu.classList.toggle('open',!open);});
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}));

    // Small ripple originates from the click point.
    document.querySelectorAll('.ripple-button').forEach(button=>button.addEventListener('click',e=>{const r=button.getBoundingClientRect();button.style.setProperty('--ripple-x',(e.clientX-r.left)+'px');button.style.setProperty('--ripple-y',(e.clientY-r.top)+'px');button.classList.remove('ripple');void button.offsetWidth;button.classList.add('ripple');setTimeout(()=>button.classList.remove('ripple'),600);}));

    // Scroll-progress rail fills the connecting line when the story reaches the timeline.
    const timeline=document.getElementById('timeline');
    const timelineObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){timeline.classList.add('visible');timeline.style.setProperty('--timeline-progress','1');}});},{threshold:.2});
    timelineObserver.observe(timeline);

    // Skills accordion; open the first category as a useful starting point.
    const skillGroups=[...document.querySelectorAll('.skill-group')];
    skillGroups.forEach((group,index)=>{const button=group.querySelector('.skill-toggle');button.addEventListener('click',()=>{const open=group.classList.toggle('open');button.setAttribute('aria-expanded',String(open));});if(index===0){group.classList.add('open');button.setAttribute('aria-expanded','true');}});

    // Project count updates as each in-progress card enters view.
    const seenProjects=new Set();
    const projectObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&!seenProjects.has(entry.target)){seenProjects.add(entry.target);document.querySelector('#project-count b').textContent=String(seenProjects.size).padStart(2,'0');}});},{threshold:.45});
    document.querySelectorAll('[data-project-card]').forEach(card=>projectObserver.observe(card));

    // Project story popups contain only supplied, in-progress descriptions.
    const projectData={embedded:{title:'Embedded systems exploration',description:'A developing focus on electronic systems, microcontrollers, and hardware–software interaction. Project-specific details will be added when real work is ready to share.',tags:['In progress','Embedded systems','Electronics']},cad:{title:'3D CAD & collaboration',description:'A developing collection of Autodesk Fusion models and GrabCAD collaboration. Model previews and shareable links will be added when ready.',tags:['In progress','Autodesk Fusion','GrabCAD']},featured:{title:'The next build',description:'An exploration of how embedded systems and electronics can solve practical problems. Specific project details, images, and outcomes will be added as they take shape.',tags:['Future project space','Learning','ECE']}};
    const modal=document.getElementById('project-modal');
    document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const item=projectData[button.dataset.project];document.getElementById('modal-title').textContent=item.title;document.getElementById('modal-description').textContent=item.description;const pills=document.getElementById('modal-pills');pills.replaceChildren(...item.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span;}));modal.showModal();}));
    modal.querySelector('.modal-close').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal)modal.close();});

    // Three-slide learning carousel: ongoing platforms and pathways, not testimonials.
    const slides=[...document.querySelectorAll('.learning-slide')],dots=[...document.querySelectorAll('.carousel-dots button')];let activeSlide=0,carouselTimer;
    function showSlide(index){activeSlide=(index+slides.length)%slides.length;slides.forEach((slide,i)=>slide.classList.toggle('active',i===activeSlide));dots.forEach((dot,i)=>dot.classList.toggle('active',i===activeSlide));}
    document.getElementById('prev-slide').addEventListener('click',()=>{showSlide(activeSlide-1);restartCarousel();});document.getElementById('next-slide').addEventListener('click',()=>{showSlide(activeSlide+1);restartCarousel();});dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);restartCarousel();}));
    function restartCarousel(){clearInterval(carouselTimer);if(!reducedMotion)carouselTimer=setInterval(()=>showSlide(activeSlide+1),6500);}
    restartCarousel();document.querySelector('.momentum').addEventListener('mouseenter',()=>clearInterval(carouselTimer));document.querySelector('.momentum').addEventListener('mouseleave',restartCarousel);

    // Copy contact details with a toast confirmation.
    const toast=document.getElementById('toast');let toastTimer;
    function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);}
    document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{const value=button.dataset.copy;try{await navigator.clipboard.writeText(value);notify('Copied to clipboard: '+value);}catch{notify('Copy unavailable here — '+value);}}));

    // The form opens an email draft; validation errors shake the relevant field group.
    const form=document.getElementById('contact-form');
    form.addEventListener('invalid',e=>{const field=e.target.closest('.field');if(field){field.classList.remove('shake');void field.offsetWidth;field.classList.add('shake');setTimeout(()=>field.classList.remove('shake'),400);}},{capture:true});
    form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const subject=encodeURIComponent('Portfolio message from '+data.get('name'));const body=encodeURIComponent('Name: '+data.get('name')+'\nEmail: '+data.get('email')+'\n\n'+data.get('message'));document.getElementById('form-status').textContent='Your email app should open. Review the draft and press Send there.';notify('Message prepared in your email app.');window.location.href='mailto:yashwanth7860@gmail.com?subject='+subject+'&body='+body;});

    // Background particles drift and form short-lived links near a mouse/trackpad.
    (()=>{
      const canvas=document.getElementById('story-particles'),ctx=canvas.getContext('2d'),pointer={x:-1000,y:-1000,active:false};
      let width=0,height=0,dpr=1,dots=[],frame=0;
      function resize(){
        width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.4);
        canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
        const count=Math.max(26,Math.min(75,Math.floor(width*height/19000)));
        dots=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16,r:.7+Math.random()*1.25,alpha:.35+Math.random()*.3,h:Math.random()<.33?'255,107,107':Math.random()<.5?'0,217,255':'255,217,61'}));
        draw();
      }
      function draw(){
        ctx.clearRect(0,0,width,height);
        for(let i=0;i<dots.length;i++){
          const d=dots[i];
          if(!reducedMotion&&!mobileMode){d.x+=d.vx;d.y+=d.vy;if(d.x<0||d.x>width)d.vx*=-1;if(d.y<0||d.y>height)d.vy*=-1;}
          const pd=Math.hypot(d.x-pointer.x,d.y-pointer.y);
          if(pointer.active&&!reducedMotion&&!mobileMode&&pd>0&&pd<145){
            const force=(145-pd)/145*.028;d.vx+=(d.x-pointer.x)/pd*force;d.vy+=(d.y-pointer.y)/pd*force;
            const velocity=Math.hypot(d.vx,d.vy);if(velocity>.36){d.vx=d.vx/velocity*.36;d.vy=d.vy/velocity*.36;}
          }
          for(let j=i+1;j<dots.length;j++){
            const n=dots[j],dist=Math.hypot(d.x-n.x,d.y-n.y);
            if(dist<115){ctx.strokeStyle=`rgba(157,183,219,${(1-dist/115)*.1})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(n.x,n.y);ctx.stroke();}
          }
          if(pointer.active&&pd<175){ctx.strokeStyle=`rgba(0,217,255,${(1-pd/175)*.35})`;ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(pointer.x,pointer.y);ctx.lineTo(d.x,d.y);ctx.stroke();}
          ctx.fillStyle=`rgba(${d.h},${d.alpha})`;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();
        }
      }
      function animate(){draw();frame=requestAnimationFrame(animate);}
      function syncAnimation(){
        if(!reducedMotion&&!mobileMode&&!frame)frame=requestAnimationFrame(animate);
        else if((reducedMotion||mobileMode)&&frame){cancelAnimationFrame(frame);frame=0;draw();}
      }
      window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;if(reducedMotion||mobileMode)draw();},{passive:true});
      window.addEventListener('pointerleave',()=>{pointer.active=false;if(reducedMotion||mobileMode)draw();});
      window.addEventListener('resize',()=>{resize();syncAnimation();},{passive:true});
      window.matchMedia('(max-width: 680px)').addEventListener('change',syncAnimation);
      resize();syncAnimation();
      window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
    })();
  
  }, []);

  return (
    <>
      
  <canvas id="story-particles" aria-hidden="true"></canvas>
  <span className="cursor-core" aria-hidden="true"></span><span className="cursor-halo" aria-hidden="true"><span className="cursor-label">MOVE</span></span>
  <Header />

  <ChapterRail />

  <main>
    <div className="wrap">
      <Hero />

      <Story />

      <Arsenal />

      <Achievements />

      <Showcase />

      <Momentum />

      <Contact />
    </div>
  </main>

  <Footer />
  <ProjectModal />
  <Toast />

  

    </>
  );
}
