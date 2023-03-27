filenametemplate "math/%j-%2c.mps";

u=1cm;
beginfig(1);
z0=(0,0);
z1=(4u,0);
draw z0--z1;
label.top("A", z0);
label.top("B", 0.75[z0,z1]);
label.top("C", 0.5[z0,z1]);
label.top("D", z1);
endfig;

end;