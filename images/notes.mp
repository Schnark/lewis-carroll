filenametemplate "notes/%j-%2c.mps";

u=1cm;
beginfig(1);
z0=(0.5u,0.5u);
z1=(3.5u,0.5u);

z2=(2u,5.5u);

z3=(u,2u);
z4=(3u,2u);

z5=(2u,2u);

z6=1/4[z0,z2];

draw z0--z1--z2--cycle;
draw z3..z4..cycle;
draw z5--z0 dashed evenly;
draw z5--z1 dashed evenly;
draw z5--z2 dashed evenly;
draw z5--z6 dashed evenly;

label.lft("(1)", (1.2u,4u));

label.lft("G", z0);
label.rt("H", z1);
label.top("W", z2);
label.ulft("O", z5);
label.lft("E", z6);
label.ulft("V", 0.7[z2,z5]);
label.urt("I", 0.15[z6,z5]);
label.rt("N", 0.55[z0,z5]);
label.top("U", 0.55[z1,z5]);

z10=(5.5u,1.4u);
z11=(8.5u,0.5u);
z12=(7u,5.5u);
z13=(6u,2u);
z14=(8u,2u);
z15=(7u,2u);
z16=(5.5u,2u);

draw z10--z11--z12--z16--cycle;
draw z13..z14..cycle;
draw z15--z10 dashed evenly;
draw z15--z11 dashed evenly;
draw z15--z12 dashed evenly;
draw z15--z16 dashed evenly;

label.lft("(2)", (6.2u,4u));

label.lft("G", z10);
label.rt("H", z11);
label.top("W", z12);
label.ulft("O", z15);
label.lft("E", z16);
label.ulft("V", 0.7[z12,z15]);
label.urt("I", 0.3[z16,z15]);
label.rt("N", 0.4[z10,z15]);
label.top("U", 0.55[z11,z15]);

endfig;

end;