filenametemplate "%j/%2c.mps";

u=1cm;
beginfig(1); %p. 2, 26, 63, 192
z0=(0,2u);
z1=(3u,2u);
z2=(0,u);
z3=(3u,u);
z4=(0.2u,2.3u);
z5=(1.8u,0);
z6=whatever[z0,z1]=whatever[z4,z5];
z7=whatever[z2,z3]=whatever[z4,z5];
draw z0--z1;
draw z2--z3;
draw z4--z5;
label.lft("A", z0);
label.rt("B", z1);
label.lft("C", z2);
label.rt("D", z3);
label.top("E", z4);
label.bot("F", z5);
label.llft("G", z6);
label.llft("H", z7);
endfig;

beginfig(2); %p. 4
z2=(3u,u);
z3=(0,u);
z4=(3.3u,0);
z5=(3.4u,3u);

z1=0.5[z2,z3];
z0=whatever[z1,z5]=whatever[z2,z4];
x6=x0-u; y6=y0;

draw z0--z4;
draw z1--z5;
draw z2--z3;
draw z0--z6 dashed evenly;

label.ulft("A", z0);
label.ulft("B", z1);
label.urt("C", z2);
label.lft("D", z3);
label.urt("E", z4);
label.ulft("F", z5);
label.urt("G", z6);
endfig;

beginfig(3); %p. 26
z0=(0,u);
z1=(3u,u);
z2=(u,2u);
z3=(2u,0);
z4=whatever[z0,z1]=whatever[z2,z3];

draw z0--z1;
draw z2--z3;

label.ulft("A", z0);
label.urt("B", z1);
label.llft("C", z0);
label.lrt("D", z1);
label.lft("E", z2);
label.rt("F", z3);
label.urt("G", z4);
label.llft("H", z4);
endfig;

beginfig(4); %p. 31
z0=(0,0);
z1=(0,u);
z2=(0,-0.5u);
z3=(4u,0);
z4=(4u,u);
z5=(2u,0.8u);

z6=(0.25u,1.1u);
z7=(0.75u,0.9u);
z8=(1.25u,1.1u);
z9=(1.75u,0.9u);
z10=(2.25u,1.1u);
z11=(2.75u,0.9u);
z12=(3.25u,1.1u);
z13=(3.75u,0.9u);

draw z0--z3;
draw z1..z6..z7..z8..z9..z10..z11..z12..z13..z4;
draw z2--z5;

label.lft("1", z0);
label.lft("2", z1);
label.lft("3", z2);
endfig;

beginfig(5); %p. 43
z1=(0.2u,0);
z2=(1.2u,0);
z3=(0.5u,u);
z4=(u,u);
z5=(0,0.5u);

draw z5--z1--z2--z4;
draw z1--z3;

label.ulft("B", z1);
label.rt("C", z2);
label.top("D", z3);
label.top("E", z4);
label.lft("F", z5);
endfig;

beginfig(6); %p. 45, 253
z0=(0,1.2u);
z1=(4u,0.8u);
z2=(0,0);
z3=(4u,0);
z4=(2u,u);
z5=(1.8u,0);
z6=(0,u);
z7=(4u,u);

draw z0--z1;
draw z2--z3;
draw z4--z5;
draw z6--z7;

label.ulft("A", z0);
label.lrt("B", z1);
label.lft("C", z2);
label.rt("D", z3);
label.top("E", z4);
label.bot("F", z5);
label.lft("G", z6);
label.rt("H", z7);
endfig;

beginfig(7); %p. 50
z0=(0,2u);
z1=(2u,2u);
z2=0.7[z0,z1];
z3=(0,0);
z4=(2u,0);
z5=0.7[z3,z4];
z6=whatever[z2,z5]=whatever[z1,z3];
x7=x0; y7=y6;
x8=x1; y8=y6;

draw z0--z1--z4--z3--cycle;
draw z1--z3;
draw z2--z5;
draw z7--z8;

label.top("A", z0);
label.top("B", z1);
label.top("C", z2);
label.bot("D", z3);
label.bot("E", z4);
label.bot("F", z5);
label.ulft("G", z6);
label.lft("H", z7);
label.rt("K", z8);
endfig;

beginfig(8); %p. 65
z0=(0,0);
z2=(2u,0);
z3=(2u,u);
z1=0.5[z0,z2];
z4=0.5[z2,z3];

draw z0--z2;
draw z1--z3;
draw z0--z4 dashed evenly;

label.lft("A", z0);
label.bot("B", z1);
label.rt("C", z2);
label.rt("H", z3);
endfig;

beginfig(9); %p. 77
z0=(0,0);
z1=(4u,0);
z2=(0,u);
z3=(4u,u);
draw z0--z1;
drawarrow 0.5[z2,z3]--z2;
drawarrow 0.5[z2,z3]--z3;
draw 0.35[z2,z3]{down}..0.65[z2,z3]{up} dashed evenly;
dotlabel.top("P", 0.5[z2,z3]);

z4=(0,2u);
z5=(4u,2u);
z6=(0,3.2u);
z7=(4u,2.2u);
z8=(4u,3.2u);
z9=(0,2.2u);
z10=whatever[z6,z7]=whatever[z8,z9];
draw z4--z5;
drawarrow z6--z7;
drawarrow z8--z9;
draw 0.6[z8,z9]{dir -70}..{dir 70}0.6[z6,z7] dashed evenly;
label.top("P", z10);

z11=(0,4u);
z12=(4u,4u);
z13=(0,4.2u);
z14=(4u,5.2u);
z15=(4u,4.2u);
z16=(0,5.2u);
z17=whatever[z13,z14]=whatever[z15,z16];
draw z11--z12;
drawarrow z13--z14;
drawarrow z15--z16;
draw 0.6[z13,z14]{dir -80}..{dir 80}0.6[z15,z16] dashed evenly;
label.top("P", z17);
endfig;

beginfig(10); %p. 94
z0=(0.3u,u);
z1=(0,0);
z2=(2u,0);
z3=0.7[z0,z2];

draw z0--z1--z2--cycle;
draw z1--z3;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.urt("D", z3);
endfig;

beginfig(11); %p. 94
z0=(u,2u);
z1=(0,1.1u);
z11=(2u,1.1u);
z4=(u,0);

z2=whatever[z0,z11];
y2=0;
z3=whatever[z0,z4]=whatever[z1,z2];

draw z0--z1--z2--cycle;
draw z0--z4;
draw z1--z11--z3;

label.top("A", z0);
label.lft("B", z1);
label.rt("B'", z11);
label.rt("C", z2);
label.llft("D", z3);
endfig;

beginfig(12); %p. 95
z0=(0.7u,u);
z1=(0,0);
z2=(2u,0);

draw z0--z1--z2--cycle;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
endfig;

beginfig(13); %p. 117
z10=(0,0.5u);
z20=(1.5u,0.5u);
z11=(0,0);
z21=(1.5u,0);

z12=(3.5u,0.5u);
z22=(2u,0);
z13=(3.5u,0);
z23=z22;

z14=(4.5u,0.5u);
z24=(6u,0.25u);
z15=(4.5u,0);
z25=(6u,0);

draw z10--z20;
draw z11--z21;
draw z12--z22;
draw z13--z23;
draw z14--z24;
draw z15--z25;

label.lft("A", z10);
label.lft("B", z11);
label.rt("C", z12);
label.rt("D", z13);
label.lft("E", z14);
label.lft("F", z15);
endfig;

beginfig(14); %p. 156
z0=(-3u,0);
z1=(3u,0);
z2=(0,-2u);
z3=(0,3u);

z4=(-2u,2u);
z5=(0,1.5u);
z6=(2u,2u);

z7=(-2u,1.5u);
z8=(0,u);
z9=(2u,0.5u);

draw z0--z1;
draw z2--z3;

draw z4..z5..z6;
draw z7..z8{right}..z9;

label.lrt("O", (0,0));
label.rt("X", z1);
label.top("Y", z3);

label.lft("M", z4);
label.urt("N", z5);
label.rt("R", z6);
label.lft("m", z7);
label.urt("n", z8);
label.rt("r", z9);
endfig;

beginfig(15); %p. 169
z0=(0,0);
z1=(3u,0);
z2=0.5[z0,z1];
z3=0.2[z0,z1];
z4=0.8[z0,z1];
x5=x2; y5=2u;

draw z0--z1;
draw z2--z5;
draw z3--z5--z4;

label.bot("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.bot("E", z4);
label.top("F", z5);
endfig;

beginfig(16); %p. 173, 174
z0=(1.7u,0.8u);
z1=(0.9u,0.6u);
z2=(0.8u,1.5u);
z3=(1.2u,1.6u);

z7=(0.4u,2u);
z9=(1.8u,1.6u);
z10=(2u,0);
z11=(0,0);

z4=whatever[z2,z3]=whatever[z7,z11];
z5=whatever[z1,z2]=whatever[z10,z11];
z6=whatever[z0,z1]=whatever[z9,z10];
z8=whatever[z0,z3]=whatever[z7,z9];

draw z0--z8;
draw z1--z6;
draw z2--z5;
draw z3--z4;
draw z7--z9--z10--z11--cycle;

label.bot("A", z0);
label.lft("B", z1);
label.top("C", z2);
label.rt("D", z3);
label.lft("M", z4);
label.ulft("P", z7);
label.top("Q", z8);
label.top("R", z9);
label.rt("S", z10);
label.lft("T", z11);
endfig;

beginfig(17); %p. 179
z0=(0,u);
z1=(4u,u);
z2=(2u,2u);
z3=(2u,0);
z4=whatever[z0,z1]=whatever[z2,z3];

draw z0--z1;
draw z2--z3;

label.lft("A", z0);
label.rt("B", z1);
label.top("O", z2);
label.bot("O'", z3);
label.urt("I", z4);
endfig;

beginfig(18); %p. 185
z0=(0,u);
z1=(0.8u,0.8u);
z2=(u,0);
z3=(0,0);

draw z0--z3--z2;
draw z3--z1;

label.ulft("A", z0);
label.rt("B", z1);
label.rt("C", z2);
label.lft("O", z3);
endfig;

beginfig(19); %p. 186
z0=(0.5u,u);
z2=(0.5u,0);
z1=0.5[z0,z2];

draw z0--z2;

label.llft("A", z0);
label.lft("B", z1);
label.ulft("C", z2);
endfig;

beginfig(20); %p. 193
z0=(0,0);
z1=(2u,0);
z2=(0.8u,1.2u);
z3=(0.8u,0.2u);
z4=(1.2u,u);
z5=(1.2u,0.2u);

draw z0--z1;
draw z2--z3;
draw z4--z5;
endfig;

beginfig(21); %p. 252, 256
z0=(0,u);
z1=(4u,u);
z2=(0,0);
z3=(4u,0);
z4=(1.5u,u);
z5=(2.5u,u);
z6=(1.5u,0);
z7=(2.5u,0);
z8=(2u,0);
z9=(2u,u);

draw z0--z1;
draw z2--z3;
draw z4--z6;
draw z5--z7;
draw z8--z9;

label.lft("A", z0);
label.rt("B", z1);
label.lft("C", z2);
label.rt("D", z3);
label.top("E", z4);
label.top("F", z5);
label.bot("G", z6);
label.bot("H", z7);
label.bot("K", z8);
label.top("L", z9);
endfig;

beginfig(22); %p. 254
z0=(0,u);
z1=(3u,u);
z2=(0,0);
z3=(3u,0);
z4=(u,u);
z5=(2u,u);
z6=(u,0);
z7=(2u,0);
z8=(2u,0.7u);

draw z0--z1;
draw z2--z3;
draw z4--z6;
draw z5--z7;
draw z4--z8;

label.lft("A", z0);
label.rt("B", z1);
label.lft("C", z2);
label.rt("D", z3);
label.top("E", z4);
label.top("F", z5);
label.bot("G", z6);
label.bot("H", z7);
label.rt("K", z8);
endfig;

beginfig(23); %p. 255
z0=(u,1.2u);
z1=(2u,1.8u);
z2=(4u,0.9u);
z3=(0,0);
z4=(5u,0);
z5=(u,0);
z6=(2u,0);
z7=(4u,0);

z8=(0.5u,1.5u);
z9=(4.5u,1.5u);

z10=whatever[z8,z9]=whatever[z1,z6];
z11=whatever[z8,z9]=whatever[z1,z0];
z12=whatever[z8,z9]=whatever[z1,z2];

draw z8--z9;
draw z3--z4;
draw z1--z0--z5;
draw z1--z6;
draw z1--z2--z7;

label.lft("A", z0);
label.top("B", z1);
label.rt("C", z2);
label.lft("D", z3);
label.rt("E", z4);
label.bot("F", z5);
label.bot("G", z6);
label.bot("H", z7);
label.lrt("K", z10);
label.ulft("L", z11);
label.urt("M", z12);
endfig;

beginfig(24); %p. 257
z0=(0,u);
z1=(5u,u);
z2=(0,0);
z3=(5u,0);
z4=(3u,u);
z5=(2u,0);
z6=(2.5u,0.5u);
z7=(2.5u,u);
z8=(2.5u,0);

draw z0--z1;
draw z2--z3;
draw z4--z5;
draw z7--z8;

label.lft("A", z0);
label.rt("B", z1);
label.lft("C", z2);
label.rt("D", z3);
label.top("E", z4);
label.bot("F", z5);
label.ulft("G", z6);
label.top("H", z7);
label.bot("K", z8);
endfig;

beginfig(25); %p. 258
z0=(u,u);
z1=(0,0);
z2=(2u,0);
z3=(0,u);
z4=(2u,u);

draw z0--z1--z2--cycle;
draw z3--z4;

label.top("A", z0);
label.lft("B", z1);
label.rt("C", z2);
label.lft("D", z3);
label.rt("E", z4);
endfig;

beginfig(26); %p. 258
z0=(0,u);
z1=(4u,u);
z2=(0,0);
z3=(4u,0);
z4=0.45[z0,z1];
z5=0.4[z2,z3];
z6=0.55[z0,z1];
z7=0.6[z2,z3];
draw z0--z1;
draw z2--z3;
draw z5--z4--z7--z6;
label.lft("A", z0);
label.rt("B", z1);
label.lft("C", z2);
label.rt("D", z3);
label.top("E", z4);
label.bot("F", z5);
label.top("G", z6);
label.bot("H", z7);
endfig;

beginfig(27); %p. 259
z0=(0,0);
z1=(u,0);
z2=(0.7u,0.6u);

z3=(2u,0);
z4=(5u,0);
z5=(4.1u,1.8u);
z6=(3u,0);
z7=(4u,0);
z8=(2.7u,0.6u);
z9=(3.4u,1.2u);
z10=(3.7u,0.6u);
z11=(4.7u,0.6u);

draw z0--z1--z2--cycle;
draw z3--z4--z5--cycle;
draw z8--z6--z10;
draw z9--z7--z11;
draw z6--z9;
label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);
label.bot("D", z3);
label.bot("E", z4);
label.top("F", z5);
label.bot("G", z6);
label.bot("H", z7);
label.ulft("K", z8);
label.ulft("L", z9);
label.urt("M", z10);
label.urt("N", z11);
endfig;

beginfig(28); %p. 261
z0=(u,2.5u);
z1=(1.7u,2u);
z2=(0,0);
z3=(u,0);
z4=(6u,0);
z5=(1.5u,2.5u);
z6=(0.25u,0.625u);
z7=(1.25u,3.125u);
z8=(5u,0);

draw z0--z1;
draw z4--z2--z7--z8;
draw z5--z0--z3--z6;

label.ulft("A", z0);
label.rt("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.rt("H", z5);
label.ulft("K", z6);
label.ulft("L", z7);
label.bot("M", z8);
endfig;
end;