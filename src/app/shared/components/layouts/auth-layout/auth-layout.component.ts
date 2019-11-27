import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { SlideConfig } from 'src/app/shared/models/slider';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit, AfterViewInit {

  slides = [
    {
      img: "../assets/img/step-1.jpg",
      step: {
        number: 1,
        title: 'Register yourself',
        description: 'Doing business on BuildSupply Commerce is very easy. Become a verified seller & Start getting RFQs.'
      }
    },
    {
      img: "../assets/img/step-2.jpg",
      step: {
        number: 2,
        title: 'Update Catalogue',
        description: 'Inbuilt catalogue of 50,000+ materials - Select the brands you supply with a single click and have your catalogue ready.'
      }
    },
    {
      img: "../assets/img/step-3.jpg",
      step: {
        number: 3,
        title: 'Respond to RFQs',
        description: 'Start getting quotes from the largest developers in India.'
      }
    },
    {
      img: "../assets/img/step-4.jpg",
      step: {
        number: 4,
        title: 'Get Orders',
        description: 'Attract buyers; Maximise your online sales and Increase your business by 10x.'
      }
    },
  ];

  slideConfig: SlideConfig;
  isSlick: boolean;
  @ViewChild('slickModal', { read: ViewContainerRef, static: true }) slickModal: SlickCarouselComponent;
  activeIndex = 0;

  constructor() { }

  ngOnInit() {
    this.configBanners();
    this.isSlick = true;
  }

  ngAfterViewInit(){
  }

  addSlide() {
    // this.slides.push({img: "http://placehold.it/350x150/777777"})
  }
  
  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }
  
  slickInit(e) {
  }
  
  breakpoint(e) {
  }
  
  afterChange(e) {
  }
  
  beforeChange(e) {
  }

  configBanners() {
    this.slideConfig = { "slidesToShow": 1, "dots": false, "autoplay": true, "slidesToScroll": 1 };
  }

  gotoSlide(slider: SlickCarouselComponent, index){
    slider.slickGoTo(index);
    this.activeIndex = index;
  }
  
}
