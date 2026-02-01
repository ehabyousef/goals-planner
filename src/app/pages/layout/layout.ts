import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBar } from '../../components/side-bar/side-bar';
import { Navbar } from "../../components/navbar/navbar";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SideBar, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
