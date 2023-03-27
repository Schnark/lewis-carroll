filenametemplate "%j/%2c.mps";

u=1cm;
beginfig(1); %Frontispice
z0=(u,u);
z1=(2u,u);
z2=(2u,2u);
z3=(u,2u);

pickup pencircle scaled 1pt;
draw z0--z1--z2--z3--cycle;

path p;
p = z0..z1..z2..z3..cycle;
draw subpath (1,4) of p dashed dashpattern(on 1bp off 2bp);
draw subpath (0,1) of p;
endfig;

beginfig(2); %p. xxi 14, 35
z0=(0,u);
z1=(u,0);
z2=(2u,u);
z3=(u,2u);
draw z00--z1--z2--z3--cycle;
draw z0--z2;
draw z1--z3;
draw z0..z1..z2..z3..cycle;
endfig;

beginfig(3); %p. 3
z0=(0,u);
z1=(2u,1.1u);
z2=(1.5u,2u);
z3=(0.7u,0);
z4=whatever[z0,z1]=whatever[z2,z3];
draw z0--z1;
draw z2--z3;
label.bot("A", z0);
label.lrt("B", z1);
label.rt("C", z2);
label.rt("D", z3);
label.lrt("E", z4);
endfig;

beginfig(4); %p. 3
z0=(0,u);
z1=(2u,1.1u);
z2=(1.5u,2u);
z3=(0.7u,0);
draw z0--z1;
draw z2--z3;
label.bot("A", z0);
label.lrt("B", z1);
label.rt("C", z2);
label.rt("D", z3);
endfig;

beginfig(5); %p. 5, 18
z0=(0,0);
z1=(2u,0);
z2=(u,1.8u);
z3=(u,2.5u);
draw z0--z1--z2--cycle;
draw z1--z3--z0;
label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);
label.top("D", z3);
endfig;

beginfig(6); %p. 6
z0=(0,0);
z1=(2u,0);
z2=(u,1.5u);
draw z0--z1--z2--cycle;
label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);

z3=(3u,0);
z4=(5u,0);
z5=(4.5u,u);
z6=0.6[z3,z5];
draw z3--z4--z5--cycle;
draw z4--z6;
label.bot("A", z3);
label.bot("B", z4);
label.top("C", z5);
label.top("F", z6);
endfig;

beginfig(7); %p. 8
z0=(0,0);
z1=(3u,0);
z2=(u,2u);
z3=1.2[z0,z1];
z4=(2.9u,1.7u);
z5=whatever[z0,z4]=whatever[z1,z2];
draw z0--z3--z4--cycle;
draw z0--z2--z1--z4;
label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);
label.rt("D", z3);
label.top("E", z4);
label.top("F", z5);
endfig;

beginfig(8); %p. 11
z0=(3u,2u);
z1=(0,u);
z2=(2u,u);
z3=(3u,0);
draw z0--z1--z2--cycle;
draw z0--z3--z1;
draw z2--z3;
label.top("A", z0);
label.lft("B", z1);
label.rt("C", z2);
label.rt("D", z3);
endfig;

beginfig(9); %p. 12
z0=(2u,2u);
z1=(0,u);
z2=(2u,u);
z3=(2u,0);
draw z0--z1--z3--cycle;
draw z1--z2;
label.top("A", z0);
label.lft("B", z1);
label.rt("C", z2);
label.rt("D", z3);
endfig;

beginfig(10); %p. 12
z0=(0.7u,u);
z1=(0,0);
z2=(u,0);
z4=(2u,u);
z3=whatever[z0,z2]=whatever[z1,z4];
draw z1--z0--z2--z1--z4--z2;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.top("D", z3);
label.top("E", z4);
endfig;

beginfig(11); %p. 15, 16
z0=(0,0);
z1=(3u,0);
z2=z1 rotated (1*90/8);
z3=z1 rotated (2*90/8);
z4=z1 rotated (3*90/8);
z5=z1 rotated (4*90/8);
z6=z1 rotated (5*90/8);
z7=z1 rotated (6*90/8);
z8=z1 rotated (7*90/8);
z9=z1 rotated (8*90/8);
draw z0--z1--z3--z5--z7--z9--cycle;
draw z1--z5--z9--cycle;
for i=2 upto 8:
	draw z0--z[i];
endfor
draw z1..z2..z3..z4..z5..z6..z7..z8..z9;
label.llft("A", z0);
label.rt("B", z1);
label.rt("C", z2);
label.rt("D", z3);
label.urt("E", z4);
label.urt("F", z5);
label.urt("G", z6);
label.top("H", z7);
label.top("J", z8);
label.top("K", z9);
endfig;

beginfig(12); %p. 20
z0=(0,0);
y10=y0;
x10+x0=2*x1;
z1=(2u,0);
z2=(1.6u,1.2u);
y20=y2;
x20+x2=2*x1;
z3=(2u,2u);
draw z0--z10--z3--cycle;
draw z0--z2--z20--z10;
draw z1--z2--z3--z20--cycle;
label.bot("A", z0);
label.bot("A'", z10);
label.bot("B", z1);
label.bot("C", z2);
label.bot("C'", z20);
label.top("D", z3);
endfig;

beginfig(13); %p. 22
z0=(0,0);
z1=(3u,0);
z2=(0.8u,u);
z3=(0,u);
z4=(3u,u);
z5=0.5[z0,z2];
x6=x5;y6=0;
x7=x5;y7=u;
z8=0.5[z1,z2];
x9=x8;y9=0;
x10=x8;y10=u;
draw z0--z1--z2--cycle;
draw z3--z4;
draw z6--z7;
draw z9--z10;
label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);
label.top("D", z3);
label.top("E", z4);
label.ulft("F", z5);
label.bot("G", z6);
label.top("H", z7);
label.urt("J", z8);
label.bot("K", z9);
label.top("L", z10);
endfig;

beginfig(14); %p. 24
z0=(0,0);
z1=(u,0);
z2=(u,0.8u);
z3=(0,0.8u);
z20=(0,u);
z20+z30=z2+z3;
draw z0--z1--z2--z3--cycle;
draw z3--z20--z30;
label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);
label.lft("D", z3);
label.ulft("C'", z20);
label.rt("D'", z30);
endfig;

beginfig(15); %p. 25
z0=(0,0);
z1=(2u,0);
z2=(2u,u);
z3=(0,u);
x10=0.8u; y10=y0;
x30=x10; y30=0.8u;
draw z0--z1--z2--z3--cycle;
draw z10--z30--z3;
draw z30--z2;
label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);
label.top("D", z3);
label.bot("A'", z10);
label.lrt("D'", z30);
endfig;

beginfig(16); %p. 26
z0=(0,0);
z1=(2u,0);
z4=(2u,u);
z5=(0,u);
x2=0.8u; y2=y4;
x3=x2; y3=y0;
draw z0--z1--z4--z5--cycle;
draw z0--z2--z1;
draw z2--z3;
label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);
label.bot("D", z3);
label.top("E", z4);
label.top("F", z5);
endfig;

beginfig(17); %p. 27
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

beginfig(18); %p. 28
%z1
%z2
z3=(-u,-0.5u);
z4=(u,-0.5u);
z5=(0,0);
z6=(0.5u,-0.5u);
z7=(-u,0);

z1=z7 rotated -17;
z2=2[z1,z5];

z8=(4.5u,0);
z9=z8 rotated 73;
z10=(0,-0.5u);
z11=5[z1,z5];
x12=x11;
y12=0;
z13=2[z11,z12];
z14=z12 rotated 34;
z15=z13 rotated 34;
z17=z12 rotated 68;
z18=z13 rotated 68;
z16=whatever[z5,z9]=whatever[z17,z18];

draw z1--z11--z13--z14--z15--z18--z5--z6;
draw z3--z4;
draw z7--z8;
draw z9--z5--z10;
draw z5--z13;
draw z5--z14;
draw z5--z15;
draw z5--z17;
draw z11--z16;

dotlabel.top("", 0.4[z5,z11]);
dotlabel.top("", 0.6[z5,z11]);
dotlabel.top("", 0.8[z5,z11]);

label.lft("A", z1);
dotlabel.top("B", z2);
label.lft("C", z3);
label.bot("D", z4);
label.ulft("E", z5);
label.bot("F", z6);
label.lft("G", z7);
label.rt("H", z8);
label.top("K", z9);
label.bot("L", z10);
label.rt("M", z11);
label.ulft("N", z12);
label.rt("R", z13);
label.rt("S", z14);
label.top("T", z15);
label.llft("V", z16);
label.top("Y", z17);
label.top("Z", z18);
endfig;

beginfig(19); %p. 33
z0=(0,0);
z1=(2u,0);
z2=z1 rotated 100;
z3=z1 rotated 50;
draw z0--z1--z3--z2--cycle;
draw z1--z2;
draw z0--z3;
draw z1..z3..z2;
label.bot("A", z0);
label.bot("B", z1);
label.lft("C", z2);
label.urt("D", z3);
endfig;

beginfig(20); %p. 34
z0=(0,0);
z1=(2u,0);
z2=z1 rotated 100;
z3=z1 rotated 50;
z4=z1 rotated 25;
z5=z1 rotated 75;
draw z0--z1--z3--z2--cycle;
draw z1--z4--z3--z5--z2;
draw z1--z2;
draw z0--z3;
draw z0--z4;
draw z0--z5;
draw z1..z3..z2;
label.bot("A", z0);
label.bot("B", z1);
label.lft("C", z2);
label.urt("D", z3);
label.urt("E", z4);
label.top("F", z5);
endfig;

beginfig(21); %p. 36
z0=(0,0);
z1=(u,0);
z2=z1 rotated 10;
z3=(0,u);
draw z0--z1--z3--cycle;
draw z0--z2;
draw z1..z2..z3;
label.llft("A", z0);
label.rt("B", z1);
label.urt("C", z2);
label.top("D", z3);
endfig;

beginfig(22); %p. 46
z20=(0,0.5u);
z21=(u,0.5u);
z22=(0.5u,0);
z23=(0.5u,2u);

z24=whatever[z20,z21]=whatever[z22,z23];
x1=x24+u;
y1=y24;
x3=x24;
y3=y24+u;
x2=x1;
y2=y3;
x4=x1+u;
y4=y1;
x5=x4;
y5=y4+0.5u;
x6=x1;
y6=y5;
x7=x4+u;
y7=y4;
x8=x7;
y8=y7+0.25u;
x9=x4;
y9=y8;

x10=x3-0.2u;
y10=y3+0.15u;
x11=x7;
y11=y7+0.125u;
x12=x7+0.7u;
y12=y7+0.077u;
x13=x12;
y13=y20;

draw z20--z13;
draw z22--z23;
draw z3--z2--z1;
draw z6--z5--z4;
draw z9--z8--z7;
draw z10..z3..z6..z9..z11..z12;

label.bot("A", z1);
label.urt("B", z2);
label.urt("C", z3);
label.bot("D", z4);
label.top("E", z5);
label.urt("F", z6);
label.bot("G", z7);
label.top("H", z8);
label.urt("K", z9);
label.ulft("L", z10);
label.urt("M", z11);
label.top("N", z12);
label.bot("X", z13);
label.top("Y", z23);
label.llft("O", z24);
endfig;

beginfig(23); %p. 49, 50, 52, 55
z1=(0,0);
z2=(6u,0);
z3=(0,3u);
z4=(6u,3u);
z5=0.5[z3,z4];

z11=0.5[z1,z2];
z10=2[z11,z5];
z20=(u,5u);
z21=2[z20,z5];
z30=(0.5u,4u);
z31=2[z30,z5];

draw z1--z2;
draw z3--z4;
draw z10--z11;
draw z20--z21;
draw z30--z31;

label.lft("A", z1);
label.rt("B", z2);
label.lft("C", z3);
label.rt("D", z4);
label.urt("V", z5);
label.top(btex $X_1$ etex, z10);
label.bot(btex $Y_1$ etex, z11);
label.top(btex $X_2$ etex, z20);
label.rt(btex $Y_2$ etex, z21);
label.top(btex $X_3$ etex, z30);
label.rt(btex $Y_3$ etex, z31);
label.top("1", (u,3u));
label.top("2", (u,1.5u));
label.top("3", (4u,u));
label.top("4", (5u,2.5u));
endfig;

beginfig(24); %p. 70
z1=(3u,2u);
z2=(1.5u,3u);
z3=(u,2u);

z4=3[z3,z1];
z5=2.5[z1,z2];
z6=2.5[z2,z3];
z7=0.5[z1,z2];
x8=x1+x3-x2;
y8=y1+y3-y2;

draw z1--z5;
draw z2--z6;
draw z3--z4;
draw z1--z8;
label.urt("A", z1);
label.top("B", z2);
label.lft("C", z3);
label.top("D", z4);
label.top("E", z5);
label.bot("F", z6);
label.urt("G", z7);
label.bot("H", z8);
endfig;

end;