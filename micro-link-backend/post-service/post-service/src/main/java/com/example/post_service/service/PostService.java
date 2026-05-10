package com.example.post_service.service;

import com.example.post_service.auth.UserContextHolder;
import com.example.post_service.clients.ConnectionClient;
import com.example.post_service.clients.UserServiceClient;
import com.example.post_service.dto.*;
import com.example.post_service.entity.Post;
import com.example.post_service.event.PostCreationEvent;
import com.example.post_service.exceptions.ResourceNotFoundException;
import com.example.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {
    private final PostRepository postRepository;
    private final ModelMapper modelMapper;
    private final UserServiceClient userServiceClient;
    private final ConnectionClient connectionClient;
    private final KafkaTemplate<Long , PostCreationEvent> kafkaTemplate;
    private final LikeService likeService;

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

        kafkaTemplate.send("post-created-topic" , savedPost.getId(), postCreationEvent);
        return modelMapper.map(savedPost , PostDto.class);

    }

    public PostDto getPostById(Long postId) {
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

    public List<PostResponseDto> getMyFeeds(){
        Long userId = UserContextHolder.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Missing X-User-Id header");
        List<Long> feedUserIds = new ArrayList<>();
        feedUserIds.add(userId);
        try {
            List<PersonDto> connections = connectionClient.getFirstConnection(userId);
            if(connections != null){
                feedUserIds.addAll(connections.stream().map(PersonDto::getUserId).collect(Collectors.toList()));
            }

        }
        catch (Exception e) {
            log.warn("Could not fetch connections for feed: {}", e.getMessage());
        }
        List<Post> rawPosts = postRepository.findByUserIdInOrderByCreatedAtDesc(feedUserIds);
        return rawPosts.stream().map(post -> {

            String resolvedAuthorName;
            try {
                UserDto author = userServiceClient.getUserById(post.getUserId());
                resolvedAuthorName = author.getName();
            } catch (Exception e) {
                resolvedAuthorName = "User " + post.getUserId();
            }

            return PostResponseDto.builder()
                    .id(post.getId())
                    .content(post.getContent())
                    .createdAt(post.getCreatedAt())
                    .userId(post.getUserId())
                    .likeCount(likeService.likeCount(post.getId()))
                    .authorName(resolvedAuthorName)
                    .build();

        }).collect(Collectors.toList());
    }
}
