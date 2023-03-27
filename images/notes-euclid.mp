filenametemplate "math/%j-%2c.mps";

u=1cm;
beginfig(1);
z0=(0.5u,2u);
z1=(0,u);
z2=(u,u);
z3=(2u,u);
z4=1.7[z0,z2];
z5=(0.5u,u);
z6=(0.5u,0);

draw z0--z1--z3;
draw z0--z4;
draw z0--z6--z2;
label.top("A", z0);
label.lft("B", z1);
label.urt("C", z2);
label.rt("D", z3);
label.bot("G", z4);
label.ulft("H", z5);
label.bot("K", z6);
endfig;

end;