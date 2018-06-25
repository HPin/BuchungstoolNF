import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Huette }         from '../huette';
import { HuetteService }  from '../huette.service';

@Component({
  selector: 'app-huette-detail',
  templateUrl: './huette-detail.component.html',
  styleUrls: [ './huette-detail.component.css' ]
})
export class HuetteDetailComponent implements OnInit {
  @Input() huette: Huette;

  constructor(
    private route: ActivatedRoute,
    private huetteService: HuetteService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHuette();
  }

  getHuette(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.huetteService.getHuette(id)
      .subscribe(huette => this.huette = huette);
  }

  goBack(): void {
    this.location.back();
  }
}