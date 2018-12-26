import assert from 'assert';
import { parseCode } from '../src/js/code-analyzer';
import { traverse } from '../src/js/code-analyzer';
import { to_testGraph } from '../src/js/code-analyzer';
import { to_test } from '../src/js/code-analyzer';
import { init } from '../src/js/code-analyzer';
import { handle_string } from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('TEST1', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x, y, z){
                let a = x + 1;
                let b = a + y;
                let c = 0;
                
                while (a < z) {
                    c = a + b;
                    z = c * 2;
                }
                
                return z;
            }`), [["x", "1"], ["y", "2"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `function foo(x, y, z) {\n    let a = x + 1;\n    let b = x + 1 + y;\n    let c = 0;\n    while (x + 1 < z) {\n        c = x + 1 + (x + 1 + y);\n
                z = (x + 1 + (x + 1 + y)) * 2;\n    }\n    return z;\n}`.replace(/\s+/g, '')
        );
    })
});



describe('The javascript parser', () => {
    it('TEST2', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x, y, z){
                let a = x + 1;
                let b = a + y;
                let c = 0;
                
                if (b < z) {
                    c = c + 5;
                    return x + y + z + c;
                } else if (b < z * 2) {
                    c = c + x + 5;
                    return x + y + z + c;
                } else {
                    c = c + z + 5;
                    return x + y + z + c;
                }
            }`), [["x", "1"], ["y", "2"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `function foo(x, y, z) {\n    let x + 1 = x + 1;\n    let x + 1 + y = x + 1 + y;\n    let x + 1 + (x + 1 + y) = 0;\n    <font size=\"5\"><b><font color=\"red\">if (</font></b></font><font size=\"5\"><b><font color=\"red\">x + 1 + y < z</font></b></font><font size=\"5\"><b><font color=\"red\">)</font></b></font> {\n
                c = x + 1 + (x + 1 + y) + 5;\n        return x + y + z + (x + 1 + (x + 1 + y) + 5);\n    } else <font size=\"5\"><b><font color=\"green\">if (</font></b></font><font size=\"5\"><b><font color=\"green\">x + 1 + y < z * 2</font></b></font><font size=\"5\"><b><font color=\"green\">)</font></b></font> {\n        c = x + 1 + (x + 1 + y) + x
              + 5;\n        return x + y + z + (x + 1 + (x + 1 + y) + x + 5);\n    } else {\n        c = x + 1 + (x + 1 + y) + z + 5;\n        return x + y + z + (x + 1 + (x + 1 + y) + z + 5);\n    }\n}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST3', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x, y, z){
                let a = x + 1;
                let b = a + y;
                let c = 0;
                z = z + 5
                
                if (b < z) {
                    c = c + 5;
                    return x + y + z + c;
                } else if (b < z * 2) {
                    c = c + x + 5;
                    return x + y + z + c;
                } else {
                    c = c + z + 5;
                    return x + y + z + c;
                }
            }`), [["x", "1"], ["y", "2"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `functionfoo(x,y,z){letx+1=x+1;letx+1+y=x+1+y;letx+1+(x+1+y)+x+5=0;z=z+5;<fontsize=\"5\"><b><fontcolor=\"red\">if(</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">x+1+y<z</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">)</font></b></font>{c=x+1+(x+1+y)+x+5+5;returnx+y+z+(x+1+(x+1+y)+x+5+5);}else<fontsize=\"5\"><b><fontcolor=\"green\">if(</font></b></font><fontsize=\"5\"><b><fontcolor=\"green\">x+1+y<z*2</font></b></font><fontsize=\"5\"><b><fontcolor=\"green\">)</font></b></font>{c=x+1+(x+1+y)+x+5+x+5;returnx+y+z+(x+1+(x+1+y)+x+5+x+5);}else{c=x+1+(x+1+y)+x+5+z+5;returnx+y+z+(x+1+(x+1+y)+x+5+z+5);}}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST4', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x, y, z){
                let a = x + 1;
                let b = a + y[0];
                let c = 0;
                
                if (b < z) {
                    c = c + 5;
                    return x + y[0] + z + c;
                } else if (b < z * 2) {
                    c = c + x + 5;
                    return x + y[0] + z + c;
                } else {
                    c = c + z + 5;
                    return x + y[0] + z + c;
                }
            }`), [["x", "1"], ["y", "[2]"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `functionfoo(x,y,z){letx+1=x+1;letx+1+y=x+1+y[0];letx+1+(x+1+y)+x+5+x+5=0;<fontsize=\"5\"><b><fontcolor=\"red\">if(</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">x+1+y<z</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">)</font></b></font>{c=x+1+(x+1+y)+x+5+x+5+5;returnx+y[0]+z+(x+1+(x+1+y)+x+5+x+5+5);}else<fontsize=\"5\"><b><fontcolor=\"red\">if(</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">x+1+y<z*2</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">)</font></b></font>{c=x+1+(x+1+y)+x+5+x+5+x+5;returnx+y[0]+z+(x+1+(x+1+y)+x+5+x+5+x+5);}else{c=x+1+(x+1+y)+x+5+x+5+z+5;returnx+y[0]+z+(x+1+(x+1+y)+x+5+x+5+z+5);}}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST5', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x, y){
                let arr = [x , y];
                return arr[0];
            }`), [["x", "1"], ["y", "2"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `functionfoo(x,y){letarr=[x,y];returnarr[0];}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST6', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x, y){
                let arr = [x , y];
                if(x){                     
                     return arr[0];
                }
                else return arr[1];
            }`), [["x", "true"], ["y", "false"]]).replace(/\s+/g, ''),
            //res:
            `functionfoo(x,y){letarr=[x,y];<fontsize=\"5\"><b><fontcolor=\"green\">if(</font></b></font><fontsize=\"5\"><b><fontcolor=\"green\">x</font></b></font><fontsize=\"5\"><b><fontcolor=\"green\">)</font></b></font>{returnx;}elsereturny;}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST7', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x, y){
                let arr = [x , y];
                if(x){                     
                     return arr[0];
                }
                return arr[1];
            }`), [["x", "true"], ["y", "false"]]).replace(/\s+/g, ''),
            //res:
            `functionfoo(x,y){let[x,y]=[x,y];<fontsize=\"5\"><b><fontcolor=\"red\">if(</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">x</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">)</font></b></font>{returnx;}returny;}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST8', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function binarySearch(X, V, n){
                let low = 0;
                let high = 0;
                let mid = 0;
                low = 0;
                high = n - 1;
                while (low <= high) {
                    mid = (low + high)/2;
                    if (X < V[mid]){
                        high = mid - 1;}
                    else if (X > V[mid]){
                        low = mid + 1;}
                    else
                        return mid;
                }
                return -1;
            }`), [["X", "2"], ["V", "3"], ["n", "4"]]).replace(/\s+/g, ''),
            //res:
            `functionbinarySearch(X,V,n){letlow=0;lethigh=0;letmid=0;low=0;high=n-1;while(0<=n-1){mid=(0+0)/2;<fontsize=\"5\"><b><fontcolor=\"red\">if(</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">X<V[(0+0)/2]</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">)</font></b></font>{high=0-1;}else<fontsize=\"5\"><b><fontcolor=\"red\">if(</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">X>V[0]</font></b></font><fontsize=\"5\"><b><fontcolor=\"red\">)</font></b></font>{low=0+1;}elsereturn0;}return-1;}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST9', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x , y){
                for(let i=0; i < y ; i++){ 
                }
                return x;
                }`), [["x", "1"], ["y", "2"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `functionfoo(x,y){for(;i<y;i++){}returnx;}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST10', () => {
        assert.equal(to_test(parseCode(
            //input:
            `function foo(x , y){
                let arr = [ 1 , 2 ];
                arr[0] = 3;
                return x;
                
                }`), [["x", "1"], ["y", "2"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `functionfoo(x,y){let[3,y]=[1,2];arr[0]=3;returnx;}`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST11', () => {
        assert.equal(init({ type: "Expression" }), undefined)
    })
});


describe('The javascript parser', () => {
    it('TEST13', () => {
        assert.equal(handle_string("true"), true)
    })
});

describe('The javascript parser', () => {
    it('TEST13', () => {
        assert.equal(handle_string("false"), false)
    })
});

describe('The javascript parser', () => {
    it('TEST14', () => {
        assert.equal(to_testGraph(
            //input:
            `function foo(x, y, z){
                let a = x + 1;
                let b = a + y;
                let c = 0;
                
                if (b < z) {
                    c = c + 5;
                } else if (b < z * 2) {
                    c = c + x + 5;
                } else {
                    c = c + z + 5;
                }
                
                return c;
            }
            `, [["x", "1"], ["y", "2"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `n0[label=\"entry\",style=\"rounded\"]n1[label=\"#1leta=x+1;\",style=\"filled\",color=\"green\",shape=\"square\"]n2[label=\"#2letb=a+y;\",style=\"filled\",color=\"green\",shape=\"square\"]n3[label=\"#3letc=0;\",style=\"filled\",color=\"green\",shape=\"square\"]n4[label=\"#4b<z\",style=\"filled\",color=\"green\",shape=\"diamond\"]n5[label=\"#5c=c+5\",shape=\"square\"]n6[label=\"#6returnc;\",style=\"filled\",color=\"green\",shape=\"square\"]n7[label=\"#7b<z*2\",style=\"filled\",color=\"green\",shape=\"diamond\"]n8[label=\"#8c=c+x+5\",style=\"filled\",color=\"green\",shape=\"square\"]n9[label=\"#9c=c+z+5\",shape=\"square\"]n10[label=\"exit\",style=\"rounded\"]n0->n1[]n1->n2[]n2->n3[]n3->n4[]n4->n5[label=\"true\"]n4->n7[label=\"false\"]n5->n6[]n6->n10[]n7->n8[label=\"true\"]n7->n9[label=\"false\"]n8->n6[]n9->n6[]`.replace(/\s+/g, '')
        );
    })
});

describe('The javascript parser', () => {
    it('TEST15', () => {
        assert.equal(to_testGraph(
            //input:
            `function foo(x, y, z){
                let a = x + 1;
                let b = a + y;
                let c = 0;
                
                while (a < z) {
                    c = a + b;
                    z = c * 2;
                    a++;
                }
                
                return z;
             }             
            `, [["x", "1"], ["y", "2"], ["z", "3"]]).replace(/\s+/g, ''),
            //res:
            `n0[label=\"entry\",style=\"rounded\"]n1[label=\"#1leta=x+1;\",style=\"filled\",color=\"green\",shape=\"square\"]n2[label=\"#2letb=a+y;\",style=\"filled\",color=\"green\",shape=\"square\"]n3[label=\"#3letc=0;\",style=\"filled\",color=\"green\",shape=\"square\"]n4[label=\"#4a<z\",style=\"filled\",color=\"green\"]n5[label=\"#5c=a+b\",shape=\"square\"]n6[label=\"#6z=c*2\",shape=\"square\"]n7[label=\"#7a++\",shape=\"square\"]n8[label=\"#8returnz;\",style=\"filled\",color=\"green\",shape=\"square\"]n9[label=\"exit\",style=\"rounded\"]n0->n1[]n1->n2[]n2->n3[]n3->n4[]n4->n5[label=\"true\"]n4->n8[label=\"false\"]n5->n6[]n6->n7[]n7->n4[]n8->n9[]`.replace(/\s+/g, '')
        );
    })
});