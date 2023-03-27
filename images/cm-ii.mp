filenametemplate "%j/%2c.mps";

u=1cm;
beginfig(1); %p. vii
z0=(0,0);
z1=(2u,0);
z2=(u,u);
z3=(1.5u,sqrt(3)/2 * u);
z4=(u,0);
z5=(x3,0);

draw z0--z1..z2..cycle;
draw z4--z3--z5;
label.bot("O", z4);
label.bot("N", z5);
label.top("P", z3);
endfig;

beginfig(2); %p. 3, 36, 50
z0=(2u,2u);
z1=(0,0);
z2=(3.5u,0);
z3=0.6[z1,z2];
z4=0.7[z2,z0];
z5=0.4[z0,z1];

draw z0--z1--z2--cycle;
draw z3--z4--z5--cycle;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("A'", z3);
label.urt("B'", z4);
label.lft("C'", z5);
endfig;

beginfig(3); %p. 6, 47
z0=(2u,2u);
z1=(0,0);
z2=(3.5u,0);
z3=(2.1u,0.9u);
z4=whatever[z1,z2]=whatever[z0,z3];
z5=whatever[z2,z0]=whatever[z1,z3];
z6=whatever[z0,z1]=whatever[z2,z3];

draw z0--z1--z2--cycle;
draw z0--z4;
draw z1--z5;
draw z2--z6;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.urt("O", z3);
label.bot("D", z4);
label.urt("E", z5);
label.ulft("F", z6);
endfig;

beginfig(4); %p. 19, 33, 34
z0=(0,0);
z1=(2u,0);
z2=(2u,u);
z3=(1.8u,1.3u);
z4=whatever[z0,z1]=whatever[z2,z3];
draw z0--z1--z2--z3--cycle;
draw z1--z4--z2 dashed evenly;
label.bot("A", z0);
label.bot("B", z1);
label.urt("C", z2);
label.top("D", z3);
label.bot("E", z4);
endfig;

beginfig(5); %p. 24
z0=(1.5u,1.9u);
z1=(0,0);
z2=(2u,0);
z3=(0,-1.5u);
z4=(2u,-2u);
z5=(0,2.2u);
z6=(2u,2u);
z7=(0,2.5u);
z8=(2u,2.5u);

draw z7--z3--z2--z1--z4--z8;
draw z5--z2--z0--z1--z6;
draw z5{right}..{dir -30}z0{dir 10}..{right}z6 dashed evenly;

label.top("A", z0);
label.lft("B", z1);
label.rt("C", z2);
label.lft("D", z3);
label.rt("E", z4);
label.lft("F", z5);
label.rt("G", z6);
endfig;

beginfig(6); %p. 29
z0=(1.5u,3u);
z1=(0,0);
z2=(4.5u,0);
z3=0.4[z0,z1];
y4=y3;
z4=whatever[z0,z2];
z5=0.5[z1,z2];
x6=x5;
z6=whatever[z3,z4];
z7=0.6[z0,z2];
z8=0.7[z0,z1];

draw z0--z1--z2--cycle;
draw z3--z4--z5--cycle;
draw z5--z0;
draw z5--z6;
draw z5--z7;
draw z5--z8;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.ulft("D", z3);
label.urt("E", z4);
label.bot("F", z5);
label.top("A'", z6);
label.urt("B'", z7);
label.ulft("C'", z8);
endfig;

beginfig(7); %p. 30
z0=(u,3u);
z1=(0,0);
z2=(4u,0);
z3=(3.5u,2.5u);
z4=0.5[z0,z1];
z5=0.5[z1,z2];
z6=0.5[z2,z3];
z7=0.5[z3,z0];

draw z0--z1--z2--z3--cycle;
draw z4--z5--z6--z7--cycle;
draw z1--z3;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.urt("D", z3);
label.lft("E", z4);
label.bot("F", z5);
label.rt("G", z6);
label.top("H", z7);
endfig;

beginfig(8); %p. 30
z0=(2u,2u);
z1=(0,0);
z2=(3.5u,0);
z3=0.6[z1,z2];
z4=0.7[z2,z0];
z5=0.4[z0,z1];
z6=(2u,0.9u);

draw z0--z1--z2--cycle;
draw z3--z4--z5--cycle;
draw z6--z3;
draw z6--z4;
draw z6--z5;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("A'", z3);
label.urt("B'", z4);
label.lft("C'", z5);
label.lrt("O", z6);
endfig;

beginfig(9); %p. 32
z0=(2u,2u);
z1=(0,0);
z2=(3u,0);
z3=0.5[z1,z2];
draw z0--z1--z2--cycle;
draw z0--z3;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
endfig;

beginfig(10); %p. 35
z0=(0,0);
z1=(3u,3u);
z2=(4u,0);
z3=(-0.2u,0.3u);
z4=2[z3,z0];
z5=0.4[z0,z1];
z6=0.3[z0,z2];
z7=(1.8u,0.9u);
f=1.8;
z8=f[z0,z5];
z9=f[z0,z6];
z10=f[z0,z7];

draw z1--z0--z2;
draw z3--z4--z6--z7--z5--cycle;
draw z0--z10;
draw z8--z10--z9;

label.lft("A", z0);
label.rt("B", z1);
label.bot("C", z2);
label.lft("E", z3);
label.llft("F", z4);
label.ulft("G", z5);
label.lrt("H", z6);
label.top("K", z7);
label.ulft("L", z8);
label.bot("M", z9);
label.rt("P", z10);
endfig;

beginfig(11); %p. 38
z0=(0,0);
z1=(3u,0);
z2=(u,u);
z3=(u,-u);
z4=(2u,0);
z5=(0.5u,0);

draw z0--z2--z1--z3--cycle;
draw z2--z4--z3--z5--cycle;
draw z0--z1;

draw (0.5u,1.3u)..z2..z3..(0.5u,-1.3u) dashed evenly;
draw (1.4u,1.5u)..z2..z3..(1.4u,-1.5u) dashed evenly;

label.lft("A", z0);
label.rt("B", z1);
label.lft("C", z2);
label.lft("D", z3);
label.lrt("E", z4);
label.llft("F", z5);
endfig;

beginfig(12); %p. 39
z0=(u,1.5u);
z1=(0.5u,0);
z2=(2u,0);
z3=(2u,1.3u);
z4=(u,0);
z5=(0,0);
draw z0--z1--z2--z3--cycle;
draw z0--z2;
draw z4--z0--z5--z1 dashed evenly;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.urt("D", z3);
label.bot("B'", z4);
label.bot("B''", z5);
endfig;

beginfig(13); %p. 40
z0=(2u,3u);
z1=(0,0);
z2=(5u,0);
z3=0.6[z0,z1];
z4=0.6[z0,z2];
z3=a[z1,z0];
z4=b[z2,z0];
z5=a[z1,z2];
z6=b[z2,z1];
z7=0.4[z3,z4];

draw z0--z1--z2--cycle;
draw z5--z3--z4--z6;
draw z1--z7--z2 dashed evenly;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.lft("D", z3);
label.rt("E", z4);
label.bot("F", z5);
label.bot("G", z6);
label.top("H", z7);
endfig;

beginfig(14); %p. 41
z0=(2u,3u);
z1=(0,0);
z2=(5u,0);
z3=0.6[z1,z2];
z4=0.7[z0,z1];
z5=0.7[z0,z2];
z6=whatever[z1,z2];
x6=x4;
z7=whatever[z1,z2];
x7=x5;

draw z0--z1--z2--cycle;
draw z6--z4--z5--z7;
draw z4--z3--z5;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("E", z3);
label.lft("F", z4);
label.rt("G", z5);
label.bot("H", z6);
label.bot("K", z7);
endfig;

beginfig(15); %p. 42
z0=(2u,3u);
z1=(0,0);
z2=(5u,0);
z3=(3u,-1.5u);
z4=whatever[z1,z2];
z4=s[z0,z3];
z5=s[z0,z1];
z6=s[z0,z2];

draw z0--z1;
draw z0--z2;
draw z0--z3;
draw z1--z2--z3--cycle;
draw z4--z5--z6--cycle;

label.top("A", z0);
label.ulft("B", z1);
label.urt("C", z2);
label.bot("D", z3);
label.llft("E", z4);
label.lft("F", z5);
label.rt("G", z6);
endfig;

beginfig(16); %p. 43
z0=(2u,3u);
z1=(0,0);
z2=(5u,0);
z3=whatever[z1,z2];
x3=x0;
z4=1.8[z1,z0];
z5=0.8[z2,z3];
z6=0.8[z2,z0];
z7=0.6[z0,z1];

draw z2--z1--z4--z2--z0--z3;
draw z0--z5;
draw z6--z5--z7;

label.ulft("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.top("E", z4);
label.bot("P", z5);
label.top("Q", z6);
label.lft("R", z7);
endfig;

beginfig(17); %p. 45, 46
z0=(2u,2u);
z1=(0,0);
z2=(3u,0);
z3=whatever[z1,z2];
x3=x0;
draw z0--z1--z2--cycle;
draw z0--z3;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.lft(btex $\alpha$ etex, 0.5[z0,z3]);
endfig;

beginfig(18); %p. 49
z0=(2u,3u);
z1=(0,0);
z2=(4.5u,0);
z3=(2.25u,u);
z4=0.5[z3,z0];
z5=0.5[z3,z1];
z6=0.5[z3,z2];

draw z0--z1--z2--cycle;
draw z4--z5--z6--cycle;
draw z0--z4;
draw z1--z3--z2;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.top("D", z3);
label.lft("A'", z4);
label.ulft("B'", z5);
label.urt("C'", z6);
endfig;

beginfig(19); %p. 52
z0=(3u,2u);
z1=(0,0);
z2=(5u,0);
z3=0.4[z1,z2];
z4=0.5[z1,z2];
z5=0.8[z0,z1];

z9=0.5[z10,z11];
z10=0.4[z0,z2];
z11=0.4[z0,z1];

z6=whatever[z1,z9];
y6=y5;
z7=0.6[z0,z2];
z8=whatever[z2,z9];
y8=y7;

draw z0--z1--z2--cycle;
draw z3--z10--z11--z4;
draw z1--z9--z2 dashed evenly;
draw z5--z6 dashed evenly;
draw z7--z8 dashed evenly;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.bot("E", z4);
label.lft("F", z5);
label.lrt("G", z6);
label.rt("H", z7);
label.llft("K", z8);
label.top("L", z9);
label.rt("B'", z10);
label.lft("C'", z11);
endfig;

beginfig(20); %p. 54
z0=(-1.8u,sqrt(4-1.8*1.8)*u);
x1=0; y1=y0;
x2=-x0; y2=y0;

z3=(-u,-sqrt(3)*u);
x4=0; y4=y3;
x5=-x3; y5=y3;

label.llft("O", (0,0));
draw (-2.5u,0)--(2.5u,0);
label.bot("X", (2.5u,0));
draw (0,-2.5u)--(0,2.5u);
label.lft("Y", (0,2.5u));

draw (0,2u)..(2u,0)..(0,-2u)..(-2u,0)..cycle;

draw z0--z2--z5--z3--cycle;
label.ulft("B", z1);
label.urt("C", z2);
label.ulft("D", z4);
label.lrt("E", z5);
endfig;

beginfig(21); %p. 55
z0=(-4u,0);
z1=(-sqrt(2*2-0.5*0.5)*u,0.5u);
z2=(0,0);
z3=2.65[z0,z1];
x4=-x1; y4=y1;

draw z2--z0--z3;
draw z1--z4;
draw (0,2u)..(2u,0)..(0,-2u)..(-2u,0)..cycle;

label.lft("A", z0);
label.ulft("B", z1);
label.bot("C", z2);
label.urt("D", z3);
label.rt("E", z4);
endfig;

beginfig(22); %p. 55
z0=(-3u,0);
z2=(0,0);
z3=(0,2u);
z1=(5/13)[z0,z3];
x4=-x1; y4=y1;

draw z0--z2--z3--cycle;
draw z1--z4;
draw (0,2u)..(2u,0)..(0,-2u)..(-2u,0)..cycle;

label.lft("A", z0);
label.ulft("B", z1);
label.bot("C", z2);
label.top("D", z3);
label.rt("E", z4);
endfig;

beginfig(23); %p. 56
z11=(0,0);

z0=(-0.6u,3.6u);
z1=(-3.3u,-2.4u);
z2=(3u,-2.4u);
x4=x1; y4=y1+1.2u;
y5=y4; z5=whatever[z11,z1];
pair bdDir; bdDir=z0 rotatedaround(z1, -90);
pair fdDir; fdDir=z1 - z0 + z5;
z3=whatever[z1,bdDir]=whatever[z5,fdDir];
z6=z1-z3+z5;
z7=z1-z4+z5;

z8=(0,-3u);
z9=z8 rotated 120;
z10=z8 rotated -120;

z12=whatever[z1,z2]=whatever[z11,z8];
z13=whatever[z2,z0]=whatever[z11,z9];
z14=whatever[z0,z1]=whatever[z11,z10];

draw z0--z1--z2--cycle;
draw z1--z3--z5--z6;
draw z1--z4--z5--z7;
draw z11--z1;
draw z11--z2;
draw z11--z8;
draw z11--z9;
draw z11--z10;
draw (0,3u)..(3u,0)..(0,-3u)..(-3u,0)..cycle;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.top("E", z4);
label.top("F", z5);
label.urt("G", z6);
label.urt("H", z7);
label.bot("K", z8);
label.urt("L", z9);
label.ulft("M", z10);
label.top("O", z11);
label.urt("A'", z12);
label.top("B'", z13);
label.urt("C'", z14);
endfig;

beginfig(24); %p. 57, 58
z0=(u,2u);
z1=(0,0);
z2=(3u,0);
z3=0.5[z5,z6];
z4=0.7[z0,z1];
z5=0.7[z0,z2];
z6=0.7[z0,z4];

draw z0--z1--z2--cycle;
draw z1--z3--z2;
draw z5--z6;
draw z2--z4 dashed evenly;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.top("D", z3);
label.lft("E", z4);
label.rt("B'", z5);
label.lft("C'", z6);
endfig;

beginfig(25); %p. 58
z0=(0,0);
z1=(-0.5u,-sqrt(2*2-0.5*0.5)*u);
x2=-x1; y2=y1;
z3=(0,-2.8u);

draw z0--z1--z3--z2--cycle;
draw z1--z2;
draw (0,2u)..(2u,0)..(0,-2u)..(-2u,0)..cycle;
draw z3+(0,u)..z3+(u,0)..z3+(0,-u)..z3+(-u,0)..cycle;

label.top("A", z0);
label.ulft("B", z1);
label.urt("C", z2);
label.bot("D", z3);
endfig;

beginfig(26); %p. 61
z0=(2u,3u);
z1=(0,0);
z2=(4.5u,0);

z4=0.5[z0,z2];
z5=0.5[z0,z1];

z3=whatever[z1,z2];
z6=whatever[z1,z2];
z7=whatever[z1,z2];
x3=x0;
x6=x4;
x7=x5;

draw z0--z1--z2--cycle;
draw z0--z3;
draw z7--z5--z3--z4--z6;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.urt("E", z4);
label.ulft("F", z5);
label.bot("G", z6);
label.bot("H", z7);
endfig;

beginfig(27); %p. 62
z0=(2u,3u);
z1=(0,0);
z2=(4.5u,0);

z4=0.5[z0,z2];
z5=0.5[z0,z1];

z8=whatever[z1,z2];
z6=whatever[z1,z2];
z7=whatever[z1,z2];
x8=x0;
x6=x4;
x7=x5;
z3=0.5[z1,z2];

draw z0--z1--z2--cycle;
draw z0--z8;
draw z7--z5--z3--z4--z6;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z8);
label.bot("E", z3);
label.urt("F", z4);
label.ulft("G", z5);
label.bot("H", z6);
label.bot("K", z7);
endfig;

beginfig(28); %p. 63, 64
z0=(u,0);
z1=(2u,3u);
z2=(0,3u);
z3=0.5[z1,z2];
z4=0.3[z2,z0];
z5=0.3[z1,z0];
z6=(u,2.5u);

draw z0--z1--z2--cycle;
draw z3--z4--z5--cycle;
draw z3--0.6[z3,z6];
draw z4--0.4[z4,z6];
draw z5--0.4[z5,z6];

label.bot("A'", z0);
label.top("B'", z1);
label.top("C'", z2);
label.top("A", z3);
label.lft("B", z4);
label.rt("C", z5);
endfig;

beginfig(29); %p. 65
z0=(u,2u);
z1=(0,0);
z2=(3u,0);
z3=0.5[z0,z2];
z4=0.5[z0,z1];
z5=whatever[z1,z3]=whatever[z2,z4];

draw z0--z1--z2--cycle;
draw z1--z3;
draw z2--z4;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.urt("D", z3);
label.ulft("E", z4);
label.top("F", z5);
endfig;

beginfig(30); %p. 68
z0=(2u,3u);
z1=(0,0);
z2=(5u,0);
z3=0.6[z1,z2];
z4=0.7[z2,z0];
z5=0.2[z0,z1];

z6=(6u,0);

z7=(8.3u,2.4u);
r1=0.65u;
z8=(7.5u,0.7u);
r2=1.7u;
z9=(10u,1.1u);
r3=1.5u;

draw z0--z1--z2--cycle;
draw z3--z4--z5--cycle;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.urt("E", z4);
label.ulft("F", z5);

draw z0+z6--z1+z6--z2+z6--cycle;
draw z3+z6--z4+z6--z5+z6--cycle;

draw z7+(0,r1)..z7+(r1,0)..z7+(0,-r1)..z7+(-r1,0)..cycle;
draw z8+(0,r2)..z8+(r2,0)..z8+(0,-r2)..z8+(-r2,0)..cycle;
draw z9+(0,r3)..z9+(r3,0)..z9+(0,-r3)..z9+(-r3,0)..cycle;

label.top("A'", z0+z6);
label.bot("B'", z1+z6);
label.bot("C'", z2+z6);
label.bot("D'", z3+z6);
label.urt("E'", z4+z6);
label.ulft("F'", z5+z6);
endfig;

beginfig(31); %p. 69
z1=(0,0);
z2=(4u,0);
z3=0.6[z1,z2];
z7=0.5[z1,z3];
z8=0.5[z3,z2];
x4=x7;
x5=x8;
x6=x3;
y4=sqrt(1.4u*1.4u-(x7-x1)*(x7-x1));
y5=sqrt(1.2u*1.2u-(x8-x2)*(x8-x2));
z6=whatever[z4,z5];

draw z1--z2;
draw z6--z3;
draw z7--z4--z5--z8;
draw z4+(0,1.4u)..z4+(1.4u,0)..z4+(0,-1.4u)..z4+(-1.4u,0)..cycle;
draw z5+(0,1.2u)..z5+(1.2u,0)..z5+(0,-1.2u)..z5+(-1.2u,0)..cycle;

label.lft("B'", z1);
label.rt("C'", z2);
label.urt("D'", z3);
label.top("G", z4);
label.top("H", z5);
label.top("K", z6);
label.bot("L", z7);
label.bot("M", z8);
endfig;

beginfig(32); %p. 71
z0=(2u,3u);
z1=(0,0);
z2=(5u,0);

z3=(3.3u,3.6u);
z4=(0.75u,3.27u);
z5=(-0.6u,0.7u);
z6=(0.3u,-1.2u);
z7=(4.75u,-1.1u);
z8=(5.43u,0.6u);

z10=0.5[z1,z2];
z11=0.5[z2,z0];
z12=0.5[z0,z1];

z9=0.15[z11,z3];

draw z0--z1--z2--cycle;
draw z10--z11--z12--cycle;
draw z11--z3--z4--z12--z9;
draw z5--z6;
draw z7--z8;
draw ((-2.5u,0)+z10..(0,2.5u)+z10..(2.5u,0)+z10) rotatedaround(z10, 180);
draw ((-3u/sqrt(2),0)+z11..(0,3u/sqrt(2))+z11..(3u/sqrt(2),0)+z11) rotatedaround(z11, -45);
draw ((-sqrt(13/4)*u,0)+z12..(0,sqrt(13/4)*u)+z12..(sqrt(13/4)*u,0)+z12) rotatedaround(z12, 56.3);

label.rt("A", z0);
label.lrt("B", z1);
label.llft("C", z2);
label.top("D", z3);
label.top("E", z4);
label.lft("F", z5);
label.lft("G", z6);
label.rt("H", z7);
label.rt("J", z8);
label.urt("K", z9);
label.bot("A'", z10);
label.urt("B'", z11);
label.lft("C'", z12);
endfig;

beginfig(33); %p. 74
z0=(2u,3u);
z1=(0,0);
z2=(5u,0);
z3=0.7[z0,z1];
z4=0.6[z0,z2];
z5=whatever[z1,z2];
x5=x3;
z6=whatever[z1,z2];
x6=x4;
z7=0.5[z3,z4];
z8=whatever[z1,z2];
x8=x7;
z9=0.5[z0,z3];
z10=whatever[z1,z2]=whatever[z7,z9];
z11=0.15[z0,z2];
z12=whatever[z9,z10]=whatever[z3,z11];
z13=whatever[z1,z2]=whatever[z3,z11];

draw z0--z1--z2--cycle;
draw z11--z13--z1;
draw z5--z3--z4--z6;
draw z7--z8;
draw z9--z10;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.lft("D", z3);
label.urt("E", z4);
label.bot("F", z5);
label.bot("G", z6);
label.top("H", z7);
label.bot("K", z8);
label.lft("L", z9);
label.bot("M", z10);
label.urt("N", z11);
label.rt("R", z12);
label.bot("S", z13);
endfig;

beginfig(34); %p. 76
z0=(2u,5u);
z1=(0,0);
z2=(5u,0);

z6=(2u,0.7u);

pair perpPa; perpPa=(z6+z2-z1) rotatedaround(z6,90);
z20=whatever[z1,z2]=whatever[z6,perpPa];
z30=2[z6,z20];
pair perpPb; perpPb=(z6+z0-z2) rotatedaround(z6,90);
z21=whatever[z2,z0]=whatever[z6,perpPb];
pair perpPc; perpPc=(z6+z1-z0) rotatedaround(z6,90);
z22=whatever[z0,z1]=whatever[z6,perpPc];
z32=2[z6,z22];

pair perpC_b; perpC_b=(z32+z0-z2) rotatedaround(z32,90);
z3=whatever[z2,z0]=whatever[z32,perpC_b];
z4=2[z32,z3];

pair perpA_b; perpA_b=(z30+z0-z2) rotatedaround(z30,90);
z5=whatever[z2,z0]=whatever[z30,perpA_b];

z8=whatever[z2,z0]=whatever[z30,z4];
z9=whatever[z1,z2]=whatever[z30,z4];

z7=whatever[z0,z1]=whatever[z32,z8];

pair parPc; parPc=z6+z0-z1;
z10=whatever[z2,z0]=whatever[z6,parPc];
pair parPb; parPb=z6+z2-z0;
z11=whatever[z0,z1]=whatever[z6,parPb];

pair perpC_PV; perpC_PV=(z22+z6-z11) rotatedaround(z22,90);
z12=whatever[z6,z11]=whatever[z22,perpC_PV];

draw z0--z1--z2--cycle;
draw z6--z30--z4--z32--z6;
draw z30--z5;
draw z6--z21;
draw z32--z8;
draw z6--z7;
draw z6--z9;
draw z6--z10;
draw z6--z11;
draw z22--z12;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.top("D", z3);
label.rt("E", z4);
label.rt("F", z5);

label.llft("P", z6);
label.ulft("Q", z7);
label.rt("R", z8);
label.lrt("S", z9);
label.urt("U", z10);
label.ulft("V", z11);
label.rt("W", z12);

label.llft("A'", z20);
label.llft("A''", z30);
label.rt("B'", z21);
label.llft("C'", z22);
label.lft("C''", z32);
endfig;

beginfig(35); %p. 78
z0=(3u,2u);
z1=(0,0);
z2=(4u,0);
z3=0.3[z0,z1];
z4=0.7[z2,z0];
z5=0.4[z1,z2];
z6=0.6[z0,z1];
z7=0.3[z2,z0];
z8=0.8[z1,z2];

draw z0--z1--z2--cycle;
draw z3--z4;
draw z5--z6;
draw z7--z8;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.lft("D", z3);
label.rt("E", z4);
label.bot("F", z5);
label.ulft("G", z6);
label.rt("H", z7);
label.bot("J", z8);
endfig;

beginfig(36); %p. 79
z0=(0,0);
z1=(5u,0);
z2=(3u,3u);

z3=(0.2u,1.27u);
z4=(5u,u);
z5=(2.35u,2.5u);

z6=(3u,0);
z7=(7u,0);
z8=(5u-sqrt(3)*u,u);

z9=z3 reflectedabout(z8,z0);
z10=z4 reflectedabout(z8,z1);
z11=z5 reflectedabout(z8,z2);

draw z0--z7;
draw z8--z3--z0--cycle;
draw z8--z4--z1--cycle;
draw z8--z5--z2--cycle;
draw z8--z9; dotlabel.top("", z9);
draw z8--z10; dotlabel.top("", z10);
draw z8--z11; dotlabel.top("", z11);
draw z0+(-1.3u,0)..z0+(0,1.3u)..z0+(1.3u,0)..z0+(0,-1.3u)..cycle;
draw z1+(-u,0)..z1+(0,u)..z1+(u,0)..z1+(0,-u)..cycle;
draw z2+(-0.8u,0)..z2+(0,0.8u)..z2+(0.8u,0)..z2+(0,-0.8u)..cycle;
draw z1+(-2u,0)..z1+(0,2u)..z1+(2u,0) dashed evenly;

label.bot("A", z0);
label.bot("B", z1);
label.urt("C", z2);
label.top("D", z3);
label.top("E", z4);
label.llft("F", z5);
label.bot("G", z6);
label.bot("H", z7);
label.urt("P", z8);
endfig;

beginfig(37); %p. 81, 82
z0=(2u,3u);
z1=(0,0);
z2=(5u,0);

z7=(2u,1.5u);
z8=0.25[z7,z0];
z9=0.25[z7,z1];
z10=0.25[z7,z2];

z3=whatever[z1,z2];
x3=x9;
z4=whatever[z1,z2];
x4=x10;

z5=0.5[z0,z1];
z6=0.45[z0,z2];

z11=0.25[z0,z1];
z12=0.2[z0,z2];

draw z0--z1--z2--cycle;
draw z8--z9--z10--cycle;
draw z7--z0;
draw z7--z1;
draw z7--z2;
draw z3--z9;
draw z4--z10;
draw z5--z9;
draw z6--z10;
draw z11--z8;
draw z12--z8;
draw z3--z5 dashed evenly;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.bot("E", z4);
label.ulft("F", z5);
label.urt("G", z6);
label.bot("O", z7);
label.rt("A'", z8);
label.lrt("B'", z9);
label.llft("C'", z10);
endfig;

beginfig(38); %p. 83, 84
z0=(-u,0);
z1=(u,0);
z2=(0,sqrt(3)*u);
z3=(0.5u,1.3u);
z4=(-0.5u,1.3u);
z5=(0,u);

draw z0--z1;
draw z0--z2--z1 dashed evenly;
draw z0..z5..z1;
draw z0{up}..{dir 30}z2..z2 rotatedaround(z1, -10);
draw z1{up}..{dir 150}z2..z2 rotatedaround(z0, 10);

label.bot("A", z0);
label.bot("B", z1);
label.top("C", z2);
label.rt("D", z3);
label.lft("E", z4);
label.bot("F", z5);
endfig;

beginfig(39); %p. 85, 87
z0=(2u,3u);
z1=(0,0);
z2=(1.5u,-2u);
z3=(5u,0);

z4=0.5[z1,z2];
z5=0.5[z2,z3];
z6=(2u,-0.5u);

z7=whatever[z1,z3]=whatever[z0,z4];
z8=whatever[z1,z3]=whatever[z0,z5];
z9=whatever[z4,z6]=whatever[z0,z2];

draw z0--z1--z2--z3--cycle;
draw z1--z7; draw z8--z3;
draw z0--z4--z9;
draw z0--z2--z6--cycle;
draw z0--z5--z6;

label.top("K", z0);
label.lft("L", z1);
label.bot("M", z2);
label.rt("N", z3);
label.llft("R", z4);
label.lrt("S", z5);
label.urt("T", z6);

label.lft("a", 0.5[z0,z1]);
label.rt("a", 0.5[z5,z3]);
label.rt("b", 0.5[z3,z0]);
label.lft("b", 0.5[z1,z4]);
label.top("c", 0.5[z8,z3]);
endfig;

beginfig(40); %p. 85
z0=(0,u);
z1=(3u,u);
z2=(u,0);
z3=(1.5u,1.5u);
draw z0--z1--z2--cycle;
draw z0--z3--z1;
label.lft("R", z0);
label.rt("S", z1);
label.bot("M", z2);
label.top("T", z3);
endfig;

beginfig(41); %p. 86
z0=(0,u);
z1=(3u,u);
z2=(u,0);
draw z0--z1--z2--cycle;
label.lft("R", z0);
label.rt("S", z1);
label.bot("M", z2);
endfig;

beginfig(42); %p. 87, 88
z0=(2u,2.5u);
z1=(0,0);
z2=(3u,0);
z3=0.4[z1,z2];
z4=0.6[z0,z1];
z5=whatever[z0,z3]=whatever[z2,z4];

draw z0--z1--z2--cycle;
draw z0--z3;
draw z2--z4 dashed evenly;
label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.ulft("B'", z4);
label.urt("D'", z5);
endfig;

beginfig(43); %p. 91
z0=(0,0);
z1=(3u,0);
z2=(3u,2.5u);
z3=0.3[z0,z2];
z4=0.7[z0,z2];
z5=0.5[z0,z1];
z6=0.5[z0,z2];
z7=0.7[z0,z1];
z8=whatever[z4,z5]=whatever[z6,z7];

draw z2--z0--z1;
draw z4--z5;
draw z6--z7;
draw z3--z8;

label.bot("A", z0);
label.bot("B", z1);
label.rt("C", z2);
label.ulft("D", z3);
label.top("E", z4);
label.bot("F", z5);
label.top("G", z6);
label.bot("H", z7);
label.rt("P", z8);
endfig;

beginfig(44); %p. 92
z0=(0,0);
z1=(-u,-u);
z2=(u,-u);
z3=(1.5u,0);

z4=(-0.7u,-2.2u);
z5=(0,-3u);
z6=(1.5u,-2.2u);
z7=(0.8u,-1.5u);

z8=(z0+z1+z2+z3)/4;
z9=(z4+z5+z6+z7)/4;
z10=(z2+z3)/2;
z11=whatever[z6,z9]; x11=x10;
z12=0.5[z8,z9];

z13=whatever[z0,z4]=whatever[z1,z2];
z14=whatever[z8,z9]=whatever[z1,z2];
z15=whatever[z0,z7]=whatever[z1,z2];

draw z0--z1--z2--z3--cycle;
draw z4--z5--z6--z7--cycle;
draw z1--z4;
draw z4--z13;
draw z3--z6;
draw z6--z2;
draw z6--z10;
draw z7--z15;
draw z8--z10--z11;
draw z14--z9--z6;

label.top("A", z0);
label.lft("B", z1);
label.ulft("C", z2);
label.top("D", z3);
label.lft("E", z4);
label.bot("F", z5);
label.bot("G", z6);
label.urt("H", z7);
label.top("J", z8);
label.lft("K", z9);
label.ulft("L", z10);
label.ulft("M", z11);
dotlabel.lft("O", z12);
endfig;

beginfig(45); %p. 94
z0=(0,0);

z1=(0.5u,2.5u);
z2=(-3u,-1.5u);
z3=(3u,-1.5u);

pair dirOa; dirOa=(z0+z3-z2) rotated 90;
pair dirOb; dirOb=(z0+z1-z3) rotated 90;
pair dirOc; dirOc=(z0+z2-z1) rotated 90;

z4=whatever[z2,z3]=whatever[z0,dirOa];
z5=whatever[z3,z1]=whatever[z0,dirOb];
z6=whatever[z1,z2]=whatever[z0,dirOc];

draw z1--z2--z3--cycle;
draw z0--z4;
draw z0--z5;
draw z0--z6;
draw (-2u,0)..(0,2u)..(2u,0)..(0,-2u)..cycle;

label.top("O", z0);

label.top("A", z1);
label.bot("B", z2);
label.bot("C", z3);
label.bot("D", z4);
label.lft("E", z5);
label.lft("F", z6);
label.bot("M", 0.25[z2,z3]);
label.bot("N", 0.75[z2,z3]);
label.rt("P", 0.4[z3,z1]);
label.rt("Q", 0.85[z3,z1]);
label.lft("R", 0.08[z1,z2]);
label.lft("S", 0.7[z1,z2]);

z7=(5u,-0.5u);

z8=(-sqrt(1.5*1.5-1)*u,-u);
x9=-x8; y9=y8;
z10=(sqrt(1.5*1.5-1.2*1.2)*u,1.2u);
x11=x8; y11=-y8;

draw z7+z8--z7+z9--z7+z10--z7+z11--cycle;
draw z7+z9--z7+z11;
draw z7+(-1.5u,0)..z7+(0,1.5u)..z7+(1.5u,0)..z7+(0,-1.5u)..cycle;
label.llft("G", z7+z8);
label.lrt("H", z7+z9);
label.top("L", z7+z10);
label.ulft("K", z7+z11);
endfig;

beginfig(46); %p. 100
z0=(4u,0);
z1=(-3.5u,-2u);
z2=(-0.5u,u);
z3=(0,-4.5u);
z4=(3.2u,u);
z5=(u,0);
z6=(2u,0);
z7=(0,0);
z8=(0,2.5u);
z9=whatever[z0,z2]=whatever[z7,z4];
z10=(5u,0);
z11=(2u,2u);
z12=(0,3.7u);
z13=(3u,3.5u);
z14=whatever[z13,z9]=whatever[z7,z12];
z15=(-4u,0);
z16=(-4u,-4u);
z17=(0,-5u);

draw z0--z2--z1--z3--cycle;
draw z0--z1;
draw z2--z3;
draw z7--z4--z13--z8;
draw z13--z14;
draw z5--z9;
draw z6--z4;

pickup pencircle scaled 1pt;
draw z10--z15;
draw z11--z16;
draw z12--z17;

label.top("A", z0);
label.llft("B", z1);
label.top("C", z2);
label.lrt("D", z3);
label.rt("L", z4);
label.bot("M", z5);
label.bot("N", z6);
label.lrt("O", z7);
label.lft("Q", z8);
label.ulft("R", z9);
label.bot("X", z10);
label.top("Y", z11);
label.top("Z", z12);
label.top("A'", z13);
label.lrt("D'", z14);
label.bot("X'", z15);
label.bot("Y'", z16);
label.bot("Z'", z17);
endfig;

beginfig(47); %p. 103, 104
z0=(2u,4u);
z1=(0,0);
z2=(5u,0);
z3=0.3[z1,z2];
z4=0.5[z2,z0];
z5=0.2[z0,z1];
z6=whatever[z1,z4]=whatever[z2,z5];
z7=whatever[z2,z5]=whatever[z0,z3];
z8=whatever[z0,z3]=whatever[z1,z4];

draw z0--z1--z2--cycle;
draw z0--z3;
draw z1--z4;
draw z2--z5;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.urt("E", z4);
label.ulft("F", z5);
label.bot("A'", z6);
label.urt("B'", z7);
label.ulft("C'", z8);
endfig;

beginfig(48); %p. 108
z0=(u,4u);
z1=(0,0);
z2=(5u,0);
z3=0.5[z1,z2];
z4=0.5[z2,z0];
z5=0.5[z0,z1];
z6=1/3[z0,z2];
z7=1/3[z0,z1];

z12=(1.8u,4/3u);
z9=fl[z1,z2]=whatever[z6,z12];
z10=fm[z2,z1]=whatever[z7,z12];
z8=fl[z1,z0];
z11=fm[z2,z0];

draw z0--z1--z2--cycle;
draw z3--z4--z5--cycle dashed evenly;
draw z6--z7--z10--z11--z8--z9--cycle;

label.top("A", z0);
label.bot("B", z1);
label.bot("C", z2);
label.bot("D", z3);
label.urt("E", z4);
label.lft("F", z5);
label.rt("G", z6);
label.lft("H", z7);
label.llft("K", z8);
label.bot("L", z9);
label.bot("M", z10);
label.urt("N", z11);
label.lrt("P", z12);
endfig;
end;