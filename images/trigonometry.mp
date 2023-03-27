filenametemplate "math/%j-%2c.mps";

u=1cm;
beginfig(1);
z0=(0,0);
z1=(u,0);
z2=(2u,0);
z3=(2u,u);
z4=(1/sqrt(2))[z1,z3];
x5=x4; y5=0;
z6=(u,u);
draw z0--z2..z6..cycle;
draw z1--z3--z2;
draw z4--z5;
label.bot("O", z1);
label.rt("A", z2);
label.top("T", z3);
label.top("B", z4);
label.bot("N", z5);
endfig;

beginfig(2);
z0=(1.5u,1.5u);
z1=z0+(u,0);
z2=z1 shifted -z0 rotated 60 shifted z0;
z3=z1 shifted -z0 rotated 120 shifted z0;
z4=z1 shifted -z0 rotated 240 shifted z0;

z5=z1 shifted -z0 scaled 1.3 shifted z0;
z6=z3 shifted -z0 scaled 1.3 shifted z0;

drawdblarrow z1..z2..z3;
drawdblarrow z3..z4..z1;
draw z6--z0--z5;
label.bot("O", z0);
label.bot("X", z5);
label.bot("S", z2);
label.top("A", z6);
label.top("L", z4);
endfig;

beginfig(3);
z0=(1.5u,1.5u);
z1=z0+(u,0);
z2=z1 shifted -z0 rotated 60 shifted z0;
z3=z1 shifted -z0 rotated 120 shifted z0;
z4=z1 shifted -z0 rotated 180 shifted z0;
z5=z1 shifted -z0 rotated 240 shifted z0;
z6=z1 shifted -z0 rotated 300 shifted z0;

z7=z1 shifted -z0 scaled 1.3 shifted z0;
z8=z3 shifted -z0 scaled 1.3 shifted z0;
z9=z4 shifted -z0 scaled 1.3 shifted z0;
z10=z5 shifted -z0 scaled 1.3 shifted z0;

drawarrow z1..z2..z3;
drawarrow z1..z6..z5;
draw z9--z7;
draw z8--z0--z10;
label.bot("O", z0);
label.bot("X", z7);
label.top("A", z8);
label.bot("X'", z9);
label.bot("A'", z10);
label.bot("S", z2);
label.top("S'", z6);
endfig;

beginfig(4);
z0=(1.5u,1.5u);
z1=z0+(u,0);
z2=z1 shifted -z0 rotated 60 shifted z0;
z3=z1 shifted -z0 rotated 120 shifted z0;

z4=z1 shifted -z0 scaled 0.8 shifted z0;
z5=z1 shifted -z0 scaled 0.8 rotated 240 shifted z0;
z6=z3 shifted -z0 scaled 0.8 shifted z0;

z7=z1 shifted -z0 scaled 0.5 shifted z0;
z8=z1 shifted -z0 scaled 0.5 rotated 60 shifted z0;
z9=z1 shifted -z0 scaled 0.5 rotated 120 shifted z0;
z10=z1 shifted -z0 scaled 0.4 rotated 240 shifted z0;
z11=z1 shifted -z0 scaled 0.3 rotated 360 shifted z0;
z12=z1 shifted -z0 scaled 0.3 rotated 420 shifted z0;
z13=z1 shifted -z0 scaled 0.3 rotated 480 shifted z0;
z14=z1 shifted -z0 scaled 0.2 rotated 600 shifted z0;
z15=z1 shifted -z0 scaled 0.2 rotated 720 shifted z0;
z16=z1 shifted -z0 scaled 0.1 rotated 780 shifted z0;
z17=z1 shifted -z0 scaled 0.1 rotated 840 shifted z0;

z18=z1 shifted -z0 scaled 1.3 shifted z0;
z19=z3 shifted -z0 scaled 1.3 shifted z0;

drawarrow z1..z2..z3;
drawarrow z4..z5..z6;
drawarrow z7..z8..z9..z10..z11..z12..z13..z14..z15..z16..z17;

draw z18--z0--z19;
label.bot("O", z0);
label.bot("X", z18);
label.top("A", z19);
label.top("S1", z2);
label.bot("S2'", z5);
label.top("S3", z8);
endfig;

beginfig(5);
z0=(u,u);
z1=z0+(0.5u,u);
z2=z0+(-0.5u,u);
z3=z0+(0.5u,-u);
z4=z0+(-0.5u,-u);
z5=(2u,u);
z6=(0,u);

draw z5--z6;
draw z1--z4--z2--z3--cycle;

label.bot("O", z0);
label.rt("A1", z1);
label.lft("A2", z2);
label.rt("A3", z3);
label.lft("A4", z4);
label.bot("X", z5);
label.bot("X'", z6);
endfig;

end;