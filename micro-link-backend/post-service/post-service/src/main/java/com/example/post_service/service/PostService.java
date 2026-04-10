package com.example.post_service.service;

import com.example.post_service.auth.UserContextHolder;
import com.example.post_service.clients.ConnectionClient;
import com.example.post_service.dto.PostCreateReqDto;
import com.example.post_service.dto.PostDto;
import com.example.post_service.entity.Post;
import com.example.post_service.event.PostCreationEvent;
import com.example.post_service.exceptions.ResourceNotFoundException;
import com.example.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final ModelMapper modelMapper;
    private final ConnectionClient connectionClient;

    private final KafkaTemplate<Long , PostCreationEvent> kafkaTemplate;

    public PostDto createNewPost(PostCreateReqDto postDto) {
        Long userId = UserContextHolder.getCurrentUserId();
        Post post = modelMapper.map(postDto , Post.class);
        post.setUserId(userId);
        Post savedPost = postRepository.save(post);

        PostCreationEvent postCreationEvent = PostCreationEvent.builder()
                .creatorId(savedPost.getUserId())
                .postId(savedPost.getId())
                .content(savedPost.getContent())
                .build();

        kafkaTemplate.send("post-create-topic" , postCreationEvent);
        return modelMapper.map(savedPost , PostDto.class);

    }

    public PostDto getPostById(Long postId) {
        connectionClient.getFirstConnection();
        Post post = postRepository.findById(postId).
                orElseThrow(() -> new ResourceNotFoundException("post with this postId does not exists"));
        return modelMapper.map(post , PostDto.class);
    }

    public List<PostDto> getAllPostsOfUser(Long userId) {
        List<Post> posts = postRepository.findByUserId(userId);

        return posts.stream().map((element)->
                modelMapper.map(element , PostDto.class))
                .collect(Collectors.toList());
    }
}
