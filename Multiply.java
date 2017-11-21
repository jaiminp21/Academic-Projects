package edu.uta.cse6331;

import java.io.*;
import java.util.*;
import org.apache.mahout.math.*;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.*;
import org.apache.hadoop.mapreduce.lib.output.*;




class Matrix implements Writable {
    public int tag;
    public int index;
    public double value;

    Matrix () {}

    Matrix ( int tag1, int index1, double val1) {
        this.tag=tag1; this.index= index1; this.value=val1;
    }

    public void write ( DataOutput out ) throws IOException {
        out.writeInt(tag);
        out.writeInt(index);
        out.writeDouble(value);
    }

    public void readFields ( DataInput in ) throws IOException {
        tag= in.readInt();
        index=in.readInt();
        value = in.readDouble();
    }
}


class Pair implements WritableComparable<Pair>{
   
    public int i;
    public int j;

    Pair () {}
    Pair(int i,int j) {this.i=i; this.j=j;}
   
  
    public void write ( DataOutput out ) throws IOException {
     
    out.writeInt(i);
    out.writeInt(j);

    }

    @Override
    public void readFields ( DataInput in ) throws IOException {
      
        this.i = in.readInt();
        this.j = in.readInt();

    }


    public int compareTo(Pair objPair1){

        int res = objPair1.i == this.i && objPair1.j == this.j ? 0: (objPair1.i == this.i && objPair1.j >this.j)? -1: (objPair1.i == this.i && objPair1.j <this.j)? 1:(objPair1.i<this.i)?1:-1;
        return res;

    }



     public String toString () { return this.i+" "+this.j; }
}

public class Multiply {

    public static class MatrixMMapper extends Mapper<Object,Text,IntWritable,Matrix> {
        @Override
        public void map ( Object key, Text value, Context context )
                        throws IOException, InterruptedException {
            Scanner s = new Scanner(value.toString()).useDelimiter(",");
            int i= s.nextInt();
            int j=s.nextInt();
            double mvalue=s.nextDouble();
            int tag=0;
            Matrix objectm = new Matrix(tag,i,mvalue);
            context.write(new IntWritable(j), objectm);
            s.close();
        }
    }

    public static class MatrixNMapper extends Mapper<Object,Text,IntWritable,Matrix> {
        @Override
        public void map ( Object key, Text value, Context context )
                        throws IOException, InterruptedException {
            Scanner s = new Scanner(value.toString()).useDelimiter(",");
            int i=s.nextInt();
            int j=s.nextInt();
            double nvalue=s.nextDouble();
            int tag = 1; 
            Matrix objectn = new Matrix(tag,j,nvalue);
            context.write(new IntWritable(i),objectn);
            s.close();
        }
    }

    public static class ResultReducer extends Reducer<IntWritable,Matrix,Pair,DoubleWritable> {
        static Vector<Matrix> matrixm = new Vector<Matrix>();
        static Vector<Matrix> matrixn = new Vector<Matrix>();
        @Override
        public void reduce ( IntWritable key, Iterable<Matrix> values, Context context )
                           throws IOException, InterruptedException {
            matrixm.clear();
            matrixn.clear();
            for(Matrix val: values){

                 

                if(val.tag == 0){
                    matrixm.add(new Matrix(val.tag,val.index,val.value));
                }else{
                    matrixn.add(new Matrix(val.tag,val.index,val.value));
                }

            }

            for(Matrix m:matrixm){
                for(Matrix n:matrixn){
                    context.write(new Pair(m.index,n.index),new DoubleWritable(m.value*n.value));
                }

            }
        }
    }   
        public static class MyMapper extends Mapper<Pair,DoubleWritable,Pair,DoubleWritable> {
        @Override
        public void map ( Pair key, DoubleWritable value, Context context )
                        throws IOException, InterruptedException {      
            context.write(key,value);
            }
        }

    public static class MyReducer extends Reducer<Pair,DoubleWritable,Pair,DoubleWritable> {
        @Override
        public void reduce ( Pair key, Iterable<DoubleWritable> values, Context context )
                           throws IOException, InterruptedException {
            double sum = 0.0;
            long count = 0;
            for (DoubleWritable v: values) {
                sum += v.get();
            }
            context.write(key,new DoubleWritable(sum));
        }
       
    }
 

    public static void main ( String[] args ) throws Exception {
        Job job = Job.getInstance();
        job.setJobName("MultiplyJob");
        job.setJarByClass(Multiply.class);
        job.setOutputKeyClass(Pair.class);
        job.setOutputValueClass(DoubleWritable.class);
        job.setMapOutputKeyClass(IntWritable.class);
        job.setMapOutputValueClass(Matrix.class);
        job.setReducerClass(ResultReducer.class);
        job.setOutputFormatClass(SequenceFileOutputFormat.class);
        MultipleInputs.addInputPath(job,new Path(args[0]),TextInputFormat.class,MatrixMMapper.class);
        MultipleInputs.addInputPath(job,new Path(args[1]),TextInputFormat.class,MatrixNMapper.class);
        FileOutputFormat.setOutputPath(job,new Path(args[2]));
        job.setNumReduceTasks(2);
        job.waitForCompletion(true);

       Job job2 = Job.getInstance();
        job2.setJobName("MyJob");
        job2.setJarByClass(Multiply.class);
        job2.setOutputKeyClass(Pair.class);
        job2.setOutputValueClass(DoubleWritable.class);
        job2.setMapOutputKeyClass(Pair.class);
        job2.setMapOutputValueClass(DoubleWritable.class);
        job2.setReducerClass(MyReducer.class);
        job2.setOutputFormatClass(TextOutputFormat.class);
        MultipleInputs.addInputPath(job2,new Path(args[2]),SequenceFileInputFormat.class,MyMapper.class);
        FileOutputFormat.setOutputPath(job2,new Path(args[3]));
        job2.waitForCompletion(true);

    }
}

