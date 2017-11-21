package edu.uta.cse6331;

import java.io.*;
import java.util.*;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.*;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.*;
import org.apache.hadoop.mapreduce.lib.output.*;

class Vertex implements Writable {
  public short tag;                 
  public long group;                
  public long VID;
  public long size;                 
  public Vector<Long> adjacent = new Vector<Long>();

  Vertex(){}

  Vertex(short t, long g){
  		tag = t; group = g;
  }

  Vertex(short t, long g, long v, Vector adj){
  		tag = t; group = g; VID = v; adjacent = adj; size = adj.size();
  }
  
  public void write ( DataOutput out ) throws IOException {
        out.writeShort(tag);
        out.writeLong(group);
        out.writeLong(VID);
        out.writeLong(size);
        for(int i=0; i<adjacent.size(); i++){
          out.writeLong(adjacent.get(i));
        }
  }

  public void readFields ( DataInput in ) throws IOException {
  		  tag = in.readShort();
        group = in.readLong();
        VID = in.readLong();
        size = in.readLong();
        adjacent = new Vector<Long>();
        for(long i=0; i<size; i++){
          adjacent.add(in.readLong());
        }
      } 
    } 

  public class Graph {

  public static class VertexMapper1 extends Mapper<Object,Text,LongWritable,Vertex> {
        static Vector<Long> adj = new Vector<Long>();
        @Override
        public void map ( Object key, Text value, Context context )
                        throws IOException, InterruptedException {
            adj.clear();
            Scanner s = new Scanner(value.toString()).useDelimiter(",");
            long vid = s.nextLong();
            Short temp = 0;
            while(s.hasNextLong()){
                adj.add(s.nextLong());
            }
            Vertex verobj = new Vertex(temp,vid,vid,adj);
            context.write(new LongWritable(vid),verobj);
            System.out.println(vid+" firstmap "+verobj.adjacent);
            s.close();
        }

      }

  public static class VertexReducer1 extends Reducer<LongWritable,Vertex,LongWritable,Vertex> {
       
        @Override
        public void reduce ( LongWritable key, Iterable<Vertex> values, Context context )
                           throws IOException, InterruptedException {
                              for(Vertex v: values){
                                System.out.println(v.VID+" "+v.adjacent);
                              context.write(key,new Vertex(v.tag,v.group,v.VID,v.adjacent));
                              }
                  }
                }

  public static class VertexMapper2 extends Mapper<LongWritable,Vertex,LongWritable,Vertex> {
        //static Vector tempver = new Vector();
        @Override
        public void map ( LongWritable key, Vertex value, Context context )
                        throws IOException, InterruptedException {
          context.write(new LongWritable(value.VID),value);
          Iterator<Long> itr = value.adjacent.iterator();
          while(itr.hasNext()){
            Short temp = 1;
            long j = itr.next();
            Vertex verobj = new Vertex(temp,value.group);
            context.write(new LongWritable(j),verobj);
          }

        }
      }

  public static class VertexReducer2 extends Reducer<LongWritable,Vertex,LongWritable,Vertex> {
        @Override
        public void reduce ( LongWritable key, Iterable<Vertex> values, Context context )
                           throws IOException, InterruptedException {

                long m = Long.MAX_VALUE;
                Vertex vt = new Vertex();
                for(Vertex val: values){
                  if(val.tag == 0){
                    vt = new Vertex(val.tag,val.group,val.VID,val.adjacent);
                  }
                    if(val.group<m){
                      m = val.group;  
                    }
                  }
                  context.write(new LongWritable(m), new Vertex((short)0,m,key.get(),vt.adjacent));
                }
        }

    public static class VertexMapper3 extends Mapper<LongWritable,Vertex,LongWritable,IntWritable> {
       
        @Override
        public void map ( LongWritable key, Vertex value, Context context )
                        throws IOException, InterruptedException {
                          int x = 1;
          context.write(key,new IntWritable(x));
        }
      }

  public static class VertexReducer3 extends Reducer<LongWritable,IntWritable,LongWritable,IntWritable> {

        @Override
        public void reduce ( LongWritable key, Iterable<IntWritable> values, Context context )
                           throws IOException, InterruptedException {
                            int m = 0;
                for(IntWritable val: values){
                    m = m + val.get();
                }
                context.write(key,new IntWritable(m));      
        }
  }
    
  public static void main ( String[] args ) throws Exception {

        Job job = Job.getInstance();
        job.setJobName("GraphMapReduce1");
        job.setJarByClass(Graph.class);
        job.setOutputKeyClass(LongWritable.class);
        job.setOutputValueClass(Vertex.class);
        job.setMapOutputKeyClass(LongWritable.class);
        job.setMapOutputValueClass(Vertex.class);
        job.setMapperClass(VertexMapper1.class);
        job.setReducerClass(VertexReducer1.class);
        job.setInputFormatClass(TextInputFormat.class);
        job.setOutputFormatClass(SequenceFileOutputFormat.class);
        FileInputFormat.setInputPaths(job,new Path(args[0]));
        FileOutputFormat.setOutputPath(job,new Path(args[1]+"/f0"));
        job.waitForCompletion(true);

        for(int i=0 ; i<5 ; i++){
          Job job1 = Job.getInstance();
          job1.setJobName("GraphMapReduce2");
          job1.setJarByClass(Graph.class);
          job1.setOutputKeyClass(LongWritable.class);
          job1.setOutputValueClass(Vertex.class);
          job1.setMapOutputKeyClass(LongWritable.class);
          job1.setMapOutputValueClass(Vertex.class);
          job1.setMapperClass(VertexMapper2.class);
          job1.setReducerClass(VertexReducer2.class);
          job1.setInputFormatClass(SequenceFileInputFormat.class);
          job1.setOutputFormatClass(SequenceFileOutputFormat.class);
          FileInputFormat.setInputPaths(job1,new Path(args[1]+"/f"+i));
          FileOutputFormat.setOutputPath(job1,new Path(args[1]+"/f"+(i+1)));
          job1.waitForCompletion(true);
        }
        

        Job job2 = Job.getInstance();
        job2.setJobName("GraphMapReduce3");
        job2.setJarByClass(Graph.class);
        job2.setOutputKeyClass(LongWritable.class);
        job2.setOutputValueClass(IntWritable.class);
        job2.setMapOutputKeyClass(LongWritable.class);
        job2.setMapOutputValueClass(IntWritable.class);
        job2.setMapperClass(VertexMapper3.class);
        job2.setReducerClass(VertexReducer3.class);
        job2.setInputFormatClass(SequenceFileInputFormat.class);
        job2.setOutputFormatClass(TextOutputFormat.class);
        FileInputFormat.setInputPaths(job2,new Path(args[1]+"/f5"));
        FileOutputFormat.setOutputPath(job2,new Path(args[2]));
        job2.waitForCompletion(true);
    }
}
